const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

// post 객체의 형식 가져오기
const { Users, Posts, Likes} = require("../models");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

// 게시글 작성
router.post('/', authMiddlewares, async (req, res) => {
    try{
        const { title, content } = req.body;
        const { userId } = res.locals.user;
        const { nickname } = res.locals.user;
        // console.log(nickname)

        await Posts.create({ 
            userId : userId, 
            nickname : nickname,
            title : title, 
            content : content,
            // likes : likes,
        });
        res.status(201).json({message: "게시글이 생성되었습니다."})
    } catch (error) {
        console.log(error);
        res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
    }
});

//게시글 조회
router.get("/", async (req, res) => {
    try {
        const post = await Posts.findAll();
        // console.log(post)

        const results = await Promise.all(post.map(async (posts) => {
            const likes = await Likes.findAll({
                where: {postId: posts.postId}
            })
            const numLikes = likes? likes.length : 0
            return {
                postId: posts.postId,
                userId: posts.userId,
                nickname: posts.nickname,
                title: posts.title,
                likes: numLikes,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt
            }
        })
    )

        // console.log(results)
        // console.log(typeof(results.postId));
        res.json({data : results});
    } catch (error) {
        console.log(error);
        res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})
    }
});

//게시글 상세 조회
router.get("/:postId", async (req, res) => {
    try {       
        const { postId } = req.params;
        const post = await Posts.findOne({ where: {postId : postId} });
        // console.log(post);
        const result = {
            postId : post.postId,
            userId : post.userId,
            nickname : post.nickname,
            title : post.title,
            content : post.content,
            createdAt : post.createdAt,
            updatedAt : post.updatedAt
        }
        // console.log(post);
        return res.status(200).json({data : result});
    } catch (error) {
        return res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})
    }
});

//게시글 수정
router.put('/:postId', authMiddlewares, async (req,res) => {
    try {
        const { userId } = res.locals.user;
        const { title, content } = req.body;
        let { postId } = req.params;
        // console.log(UserId)
        // console.log(postId)
        const post = await Posts.findOne({
            where: {
                [Op.or] : [{ postId }]
            },
        });
        // console.log(post.userId)

        // console.log(title.length);
        if(content === undefined && title === undefined){
            return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
        };
        if(title.length === 0){
            return res.status(412).json({errorMessage : "게시글 제목의 형식이 일치하지 않습니다."})
        };
        if(content.length === 0){
            return res.status(412).json({errorMessage : "게시글 내용의 형식이 일치하지 않습니다."})
        };
        if(post === null) {
            return res.status(404).json({message: '게시글 조회에 실패하였습니다.'})
        };
        if(userId !== post.userId ) {
            return res.status(401).json({errorMessage: "게시글을 수정하실 수 없습니다."})
        };
        if (post.title === title && post.content === content) {
            return res.status(401).json({errorMessage: "수정 할 내용이 없습니다."})
        }

        await Posts.update({title : title, content : content}, {where: {postId : postId}});
        res.json({ message: "게시물을 수정하였습니다."})
    } catch (error){
      console.log(error)
      res.status(400).json({errorMessage: "게시글 수정에 실패하였습니다."})
    }
  });

// 게시글 삭제
router.delete("/:postId", authMiddlewares, async (req,res) => {
    try {
        const { postId } = req.params;
        const { userId } = res.locals.user;
        
        const post = await Posts.findOne({
            where: {
                [Op.or] : [{ postId }]
            },
        });
        // console.log(userId, post)
        
        if (post === null) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})
        };
        if (userId !== post.userId ) {
            return res.status(401).json({errorMessage: "게시글을 수정하실 수 없습니다."})
        };
        const delPost = await post.destroy();
          if (delPost === 0) {
            return res.status(404).json({errorMessage: "게시글이 정상적으로 삭제되지 않았습니다."});
          }
          return res.status(200).send({ message: "게시글을 삭제하였습니다." });
    } catch (error) {
        console.log(error);
        res.status(400).json({errorMessage: "게시글 삭제에 실패하였습니다."})
    }
});

module.exports = router;