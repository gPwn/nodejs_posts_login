const express = require("express");
const router = express.Router();

// post 객체의 형식 가져오기
const Posts = require("../schemas/post.js");

// 게시글 작성
router.post("/", async (req, res) => {
    try {
        const { user, password, title, content } = req.body;
        // console.log(req.body);

        await Posts.create({user, password, title, content});
        res.status(201).json({massage : "게시글을 생성하였습니다."});
    } catch (error) {
        // console.log(error);
        res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
    }
});

//게시글 조회
router.get("/", async (req, res) => {
    const post = await Posts.find();
    // console.log(post)

    const results = post.map((posts) => {
        return {
            "postId" : posts._id,
            "user" : posts.user,
            "title" : posts.title,
            "createdAt" : posts.createdAt
        }
    });

    // console.log(results)
    // console.log(typeof(results.postId));
    res.json({data : results});
});

//게시글 상세 조회
router.get("/:_postId", async (req, res) => {
    try {
        const { _postId } = req.params;
        const post = await Posts.findOne({ _id : _postId });
        const result = {
            post_Id : post._id,
            user : post.user,
            title : post.title,
            content : post.content,
            createdAt : post.createdAt
        }
        // console.log(post);
        res.status(200).json({data : result});
    } catch (error) {
        res.status(400).json({message :  "데이터 형식이 올바르지 않습니다."})
    }
});

//게시글 수정
router.put("/:_postId", async (req,res) => {
    try {
        const { _postId } = req.params;
        const { password, title, content } = req.body;

        const post = await Posts.findOne({ _id : _postId });
        // console.log(post);
        if (post !== null) {
            await Posts.updateOne(
                { _id : _postId },
                { $set : { password, title, content }}
            )
            res.status(200).json({message : "게시글을 수정하였습니다."});
        } else {
            res.status(404).json({message : "게시글 조회에 실패하였습니다."});
        }
    } catch (error) {
        res.status(400).json({massage:'데이터 형식이 올바르지 않습니다.'})
    }
});

// 게시글 삭제
router.delete("/:_postId", async (req,res) => {
    try {
        const { _postId } = req.params;
        const password = req.body.password;
        // console.log(password);

        // const post = await Posts.findOne({ _id : _postId });
        const post = await Posts.findById(_postId);
        // console.log(post.password);
        if (post.password === Number(password)) {
            await post.delete();
            res.json({massage : "게시글을 삭제하였습니다."});
        } else {
            res.status(404).json({message : "게시글 조회에 실패하였습니다."});
        }
    } catch (error) {
        res.status(400).json({massage:'데이터 형식이 올바르지 않습니다.'})
    }
});


module.exports = router;