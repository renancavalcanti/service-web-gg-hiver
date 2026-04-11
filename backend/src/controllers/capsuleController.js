const Capsule = require('../models/Capsule');
const User = require('../models/User');
const { getIO } = require('../socket/socket');

const formatCapsule = (capsule, currentUserId = null) => {
  const now = new Date();
  const capsuleObj = capsule.toObject ? capsule.toObject() : capsule;
  const authorId = capsuleObj.author?._id?.toString() || capsuleObj.author?.toString();
  const recipientId = capsuleObj.recipient?._id?.toString() || capsuleObj.recipient?.toString();
  const isAuthor = currentUserId && authorId === currentUserId;
  const isRecipient = currentUserId && recipientId === currentUserId;
  const canOpenByDate = capsuleObj.openAt <= now;
  const canOpen = canOpenByDate || isAuthor || isRecipient;

  return {
    ...capsuleObj,
    isLocked: !canOpen,
    canOpen: canOpen
  };
};

exports.createCapsule = async (req, res) => {
  try {
    const { content, imageUrl, recipientEmail, openAt } = req.body;
    
    let recipientId = null;
    if (recipientEmail) {
      const recipient = await User.findOne({ email: recipientEmail });
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }
      recipientId = recipient._id;
    }

    const capsule = await Capsule.create({
      content,
      imageUrl: imageUrl || '',
      author: req.userId,
      recipient: recipientId,
      openAt: new Date(openAt)
    });

    const populatedCapsule = await Capsule.findById(capsule._id)
      .populate('author', 'name email')
      .populate('recipient', 'name email');

    const formattedCapsule = formatCapsule(populatedCapsule, req.userId);

    getIO().emit('capsule:created', formattedCapsule);

    if (recipientId) {
      getIO().to(recipientId.toString()).emit('capsule:received', formattedCapsule);
    }

    res.status(201).json({
      message: 'Capsule created successfully',
      capsule: formattedCapsule
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating capsule', error: error.message });
  }
};

exports.getAllCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({
      $or: [
        { author: req.userId },
        { recipient: req.userId }
      ]
    })
      .populate('author', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    const formattedCapsules = capsules.map(capsule => {
      const isAuthor = capsule.author._id.toString() === req.userId;
      const isRecipient = capsule.recipient && capsule.recipient._id.toString() === req.userId;
      const canOpenByDate = capsule.openAt <= new Date();

      if (!canOpenByDate && !isAuthor && !isRecipient) {
        return null;
      }

      return formatCapsule(capsule, req.userId);
    }).filter(c => c !== null);

    res.json({ capsules: formattedCapsules });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching capsules', error: error.message });
  }
};

exports.getCapsuleById = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id)
      .populate('author', 'name email')
      .populate('recipient', 'name email');

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const now = new Date();
    const isAuthor = capsule.author._id.toString() === req.userId;
    const isRecipient = capsule.recipient && capsule.recipient._id.toString() === req.userId;
    const canOpenByDate = capsule.openAt <= now;

    if (!canOpenByDate && !isAuthor && !isRecipient) {
      return res.status(403).json({ 
        message: 'This capsule is locked until ' + capsule.openAt.toISOString(),
        openAt: capsule.openAt,
        isLocked: true
      });
    }

    res.json({ capsule: formatCapsule(capsule, req.userId) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching capsule', error: error.message });
  }
};

exports.openCapsule = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id)
      .populate('author', 'name email')
      .populate('recipient', 'name email');

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const now = new Date();
    const isAuthor = capsule.author._id.toString() === req.userId;
    const isRecipient = capsule.recipient && capsule.recipient._id.toString() === req.userId;
    const canOpenByDate = capsule.openAt <= now;

    if (!canOpenByDate && !isAuthor && !isRecipient) {
      return res.status(403).json({ 
        message: 'This capsule is locked until ' + capsule.openAt.toISOString(),
        openAt: capsule.openAt,
        isLocked: true
      });
    }

    if (!capsule.isOpened) {
      capsule.isOpened = true;
      await capsule.save();
      getIO().emit('capsule:opened', { id: capsule._id });
    }

    res.json({ capsule: formatCapsule(capsule, req.userId) });
  } catch (error) {
    res.status(500).json({ message: 'Error opening capsule', error: error.message });
  }
};

exports.updateCapsule = async (req, res) => {
  try {
    const { content, imageUrl, openAt } = req.body;
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    if (capsule.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this capsule' });
    }

    if (capsule.isOpened) {
      return res.status(400).json({ message: 'Cannot edit an opened capsule' });
    }

    capsule.content = content || capsule.content;
    capsule.imageUrl = imageUrl !== undefined ? imageUrl : capsule.imageUrl;
    if (openAt) {
      capsule.openAt = new Date(openAt);
    }
    await capsule.save();

    const populatedCapsule = await Capsule.findById(capsule._id)
      .populate('author', 'name email')
      .populate('recipient', 'name email');

    const formattedCapsule = formatCapsule(populatedCapsule, req.userId);

    getIO().emit('capsule:updated', formattedCapsule);

    res.json({
      message: 'Capsule updated successfully',
      capsule: formattedCapsule
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating capsule', error: error.message });
  }
};

exports.deleteCapsule = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);

    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    if (capsule.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this capsule' });
    }

    await Capsule.findByIdAndDelete(req.params.id);

    getIO().emit('capsule:deleted', { id: req.params.id });

    res.json({ message: 'Capsule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting capsule', error: error.message });
  }
};

exports.getReceivedCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ recipient: req.userId })
      .populate('author', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    const formattedCapsules = capsules.map(capsule => formatCapsule(capsule, req.userId));

    res.json({ capsules: formattedCapsules });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching received capsules', error: error.message });
  }
};

exports.getSentCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.find({ author: req.userId, recipient: { $ne: null } })
      .populate('author', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    const formattedCapsules = capsules.map(capsule => formatCapsule(capsule, req.userId));

    res.json({ capsules: formattedCapsules });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sent capsules', error: error.message });
  }
};
