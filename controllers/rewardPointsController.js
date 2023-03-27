const RewardPoint = require('../models/rewards');

exports.addRewardPoints = async (req, res) => {
  try {
    const { userId, actionType, points } = req.body;
    const rewardPoint = new RewardPoint({ userId, actionType, points });

    await rewardPoint.save();
    res.status(201).json(rewardPoint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRewardPoints = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rewardPoints = await RewardPoint.find({ userId: userId });
    const totalPoints = rewardPoints.reduce(
      (acc, rewardPoint) => acc + rewardPoint.points,
      0
    );
    const claimedRewards = rewardPoints.map((rewardPoint) => ({
      actionType: rewardPoint.actionType,
      points: rewardPoint.points,
    }));

    res.status(200).json({ totalPoints: totalPoints, claimedRewards: claimedRewards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};