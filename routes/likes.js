const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

// post 객체의 형식 가져오기
const { Posts, Likes } = require("../models");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

router.get('/like', authMiddlewares, async (req,res) =>{
    try {
        const { userId } = res.locals.user;
        // console.log(userId);
        const userLikes = await Likes.findAll({where : {userId}});
        // console.log(userLikes);

        const results = userLikes.map((userlike) => {
            return {
                postId : userlike.postId,
                userId : userlike.userId,
                nickname : userlike.nickname,
                title : userlike.title,
                createdAt : userlike.createdAt,
                updatedAt : userlike.updatedAt,
                likes : 1
            }
        })
    res.json({data : results});
    } catch (error) {
        res.status(400).json({errorMessage : "좋아요 게시글 조회에 실패하였습니다."})
    }
})

router.put('/:postId/like', authMiddlewares, async (req, res) => {
    // console.log("/postId/like입니다")
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;

        // console.log(postId, userId)
        const post = await Posts.findOne({
            where: {
                [Op.or] : [{ postId }]
            },
        });
        // console.log(post)

        if(post === null) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        };

        let isLike = await Likes.findOne({
            where: {
                [Op.and] : [{ postId, userId }]},
          });
        const nickname = post.nickname
        const title = post.title
    
        if (!isLike) {
        await Likes.create({ postId, userId, title, nickname});
        return res
            .status(200)
            .json({ message: '게시글의 좋아요를 등록하였습니다.' });
        } else {
        await Likes.destroy({
            where: { postId, userId },
        });
        return res
            .status(200)
            .json({ message: '게시글의 좋아요를 취소하였습니다.' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({errorMessage: "게시글 좋아요에 실패하였습니다."})
    }
});

module.exports = router;