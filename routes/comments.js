const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

// comment 객체의 형식 가져오기
const { Comments } = require("../models");
const { Posts } = require("../models");
const authMiddlewares = require("../middlewares/authMiddlewares.js");


router.get('/', (req, res) => {
    res.send('Hyeju_Api_nodejs_post');
  });

//댓글 생성
router.post("/:postId", authMiddlewares, async (req, res) => {        
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        const { userId, nickname } = res.locals.user
        console.log(comment);

        if(comment === undefined) {
            return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
        };
        if(comment.length === 0) {
            return res.status(412).json({errorMessage: "댓글 내용을 입력해주세요"})
        }

        await Comments.create({ 
            postId : postId,
            userId : userId, 
            nickname : nickname,
            comment : comment
        });
        res.status(201).json({massage : "댓글을 생성하였습니다."});
    } catch (error) {
        console.log(error)
        return res.status(400).json({errorMessage: "댓글 작성에 실패하였습니다."})
    }
});

//댓글 목록조회
router.get("/:postId",  async (req, res) => {
    try{
        const { postId } = req.params;
        const comment = await Comments.findAll({ where: {postId : postId} });
        // console.log(postId);
        // console.log(comment);
        const result = comment.map((comments) => {
                return {
                    "commentId" : comments.commentId,
                    "userId" : comments.userId,
                    "nickname" : comments.nickname,
                    "comment" : comments.comment,
                    "createdAt" : comments.createdAt,
                    "updatedAt" : comments.updatedAt
                }
        });
        res.status(200).json({data : result});
    } catch (error) {
        res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
    }
});

//댓글 수정
router.put("/:commentId", authMiddlewares, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        const { userId } = res.locals.user;

        const commentList = await Comments.findOne({
            where: {
                [Op.or] : [{ commentId }]
            },
        });
        // console.log(commentList);
        if (userId !== commentList.userId) {
            return res.status(400).json({errorMessage:'댓글 수정할 권한이 없습니다.'})
        };
        if(comment === undefined){
            return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
        };
        if(commentList === null) {
            return res.status(404).json({errorMessage:"댓글이 존재하지 않습니다."})
        };

        await Posts.update({comment}, {where: {commentId}});
        res.status(200).json({message : "댓글을 수정하였습니다."});
    } catch (error) {
        // console.log(error);
        res.status(400).json({errorMessage:'댓글 수정이 정상적으로 처리되지 않았습니다.'})
    }
});

//댓글 삭제
router.delete("/:commentId", authMiddlewares, async (req,res) => {
    try {
        const { commentId } = req.params;
        const { userId } = res.locals.user;
        
        const comment = await Comments.findOne({
            where: {
                [Op.or] : [{commentId : commentId}]
            },
        });
        console.log(userId);
        if (comment === null) {
            return res.status(400).json({errorMessage: "댓글이 존재하지 않습니다."});
        };
        if (userId !== comment.userId) {
            return res.status(400).json({errorMessage:'댓글을 삭제할 권한이 없습니다.'})
        }
        await comment.destroy();
        return res.status(200).send({ message: "댓글을 삭제하였습니다." });
    } catch (error) {
        res.status(400).json({errorMessage: "댓글 삭제가 정상적으로 처리되지 않았습니다."});
    }
});


module.exports = router;