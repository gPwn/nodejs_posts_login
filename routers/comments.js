const express = require("express");
const router = express.Router();

// comment 객체의 형식 가져오기
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");

//댓글생성(댓글이 생성하였습니다 에러가 안됨)
router.post("/:_postId", async (req, res) => {        
    try {
        const { _postId } = req.params;
        const post = await Posts.findOne({ _id : _postId });
        const { user, password, content } = req.body;

        if (post === null) {
            return res.status(400).json({massage : "댓글을 생성해주세요."});
        }
        if (content.length === 0) {
            return res.status(400).json({message : "댓글 내용을 입력해주세요."});
        }
        await Comments.create({user, password, content, _postId});
        res.status(201).json({massage : "댓글을 생성하였습니다."});
    } catch (error) {
        return res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
    }
});

//댓글 목록조회
router.get("/:_postId", async (req, res) => {
    try{
        const { _postId } = req.params;
        const post = await Posts.findOne({ _id : _postId });
        const comments = await Comments.find({ _postId : _postId});
        // console.log(_postId);
        // console.log(comments);
        const result = comments.map(comment => {
                return {
                    "commentId" : comment._id,
                    "user" : comment.user,
                    "content" : comment.content,
                    "createdAt" : comment.createdAt
                }
        });
        res.status(200).json({data : result});
    } catch (error) {
        res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
    }
});

//댓글 수정
router.put("/:_commentId", async (req, res) => {
    try {
        const { _commentId } = req.params;
        const { password, content } = req.body;
        // console.log(req.params);

        const comment = await Comments.findById(_commentId);
        console.log(comment);
        if (content.length === 0) {
            return res.status(400).json({massage:'댓글 내용을 입력해주세요.'})
        };
        if (comment !== null) {
            await Comments.updateOne(
                { _id : _commentId },
                { $set : { password, content }}
            )
            res.status(200).json({message : "댓글을 수정하였습니다."});
        } else {
            res.status(404).json({message : "댓글 조회에 실패하였습니다."});
        }
    } catch (error) {
        res.status(400).json({massage:'데이터 형식이 올바르지 않습니다.'})
    }
});

//댓글 삭제
router.delete("/:_commentId", async (req,res) => {
    try {
        const { _commentId } = req.params;
        const password = req.body.password;
        // console.log(_commentId); //638b22712cdcc6d33d9620ad
        // console.log(password)
        
        const comment = await Comments.findById(_commentId);
        // console.log(comment.password);
        if (comment.password === Number(password)) {
            await comment.delete();
            res.json({massage : "댓글을 삭제하였습니다."});
        } else {
            res.status(404).json({message : "댓글 삭제에 실패하였습니다."});
        }
    } catch (error) {
        res.status(400).json({massage:'데이터 형식이 올바르지 않습니다.'})
    }
});


module.exports = router;