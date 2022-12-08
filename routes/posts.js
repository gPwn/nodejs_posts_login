const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

// post 객체의 형식 가져오기
const { Posts } = require("../models");
const { Likes } = require("../models");
const { Users } = require("../models");
const authMiddlewares = require("../middlewares/authMiddlewares.js");

// 게시글 작성
router.post('/', authMiddlewares, async (req, res) => {
    try{
        const { title, content } = req.body;
        const { UserId } = res.locals.user;
        const { nickname } = res.locals.user;
        console.log(nickname)

        await Posts.create({ 
            userId : UserId, 
            nickname : nickname,
            title : title, 
            content : content
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

        const results = post.map((posts) => {
            return {
                "postId" : posts.postId,
                "userId" : posts.userId,
                "nickname" : posts.nickname,
                "title" : posts.title,
                "createdAt" : posts.createdAt,
                "updatedAt" : posts.updatedAt
            }
        });

        // console.log(results)
        // console.log(typeof(results.postId));
        res.json({data : results});
    } catch (error) {
        res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})
    }
});

//게시글 상세 조회
router.get("/:postId", async (req, res, next) => {
    const { postId } = req.params;

    if (postId === "like") {
        next();
    } else {
        try {        
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
    };
});

//게시글 수정
router.put('/:postId', authMiddlewares, async (req,res) => {
    try {
        const { UserId } = res.locals.user;
        const { title, content } = req.body;
        let { postId } = req.params;
        const posts = await Posts.findOne({
            where: {
                [Op.or] : [{postId : postId}]
            },
        });

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
        if(posts === null) {
            return res.status(404).json({message: '게시글 조회에 실패하였습니다.'})
        };
        if(UserId !== posts.userId || posts.title === title && posts.content === content) {
            return res.status(401).json({errorMessage: "게시글이 정상적으로 수정되지 않았습니다."})
        };

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
        const { user } = res.locals;
        
        const posts = await Posts.findOne({
            where: {
                [Op.or] : [{postId : postId}]
            },
        });
        
        if (posts === null) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."})
        };
        const delPost = await posts.destroy();
          if (delPost === 0) {
            return res.status(404).json({errorMessage: "게시글이 정상적으로 삭제되지 않았습니다."});
          }
          return res.status(200).send({ message: "게시글을 삭제하였습니다." });
    } catch (error) {
        console.log(error);
        res.status(400).json({errorMessage: "게시글 삭제에 실패하였습니다."})
    }
});


//likes
// router.get("/like", authMiddlewares, async (req, res) => {
//     try {
//       const { user } = res.locals;
//       const data = await Likes.findAll({
//         where: { userId: user.userId },
//         include: [
//           {
//             model: Posts,
//             attributes: { exclude: ["content", "postId"] },
//             include: [
//               { model: Likes, as: "Likes", attributes: ["likeId"] },
//               { model: Users, attributes: ["nickname"] },
//             ],
//           },
//         ],
//       });
//       let posts = [];
//       data.forEach((e) => {
//         posts.push({
//           postId: e.postId,
//           userId: e.Post.UserId,
//           nickname: e.Post.User.nickname,
//           title: e.Post.title,
//           createdAt: e.createdAt,
//           updatedAt: e.updatedAt,
//           likes: e.Post.Likes.length,
//         });
//       });
//       posts.sort((a, b) => b.likes - a.likes);
  
//       return res.status(200).json({ data: posts });
//     } catch (err) {
//       console.log(err);
//       return res.status(400).send({ errorMessage: "catch 블럭의 매뉴얼 에러" });
//     }
//   });
// router.get('/like', authMiddlewares, async (req, res) => {
//     const { UserId, postId, nickname, title, createdAt, updatedAt } = res.locals.user;
//     console.log({ UserId, postId, nickname, title, createdAt, updatedAt, Likes })
//     // let userLikes = await Likes.findAll({
//     //     where: { UserId },
//     //   });
//     // console.log(userLikes)
//     res.send('Hyeju_Api_nodejs_post');
// });
// router.get('/like' , authMiddlewares, async (req, res) => {
//     try {
//       const { UserId } = res.locals.user;

//       let userLikes = await Likes.findAll({
//         where: { UserId },
//       });

//       const postsQuery = `
//                 SELECT p.postId, u.userId, u.nickname, p.title, p.createdAt, p.updatedAt
//                 FROM Posts AS p
//                 JOIN Users AS u
//                 ON p.UserId = u.UserId
//                 ORDER BY p.postId DESC`;


//         const getLikePostIdByLikes = (likes) => {
//             let likePostIdArray = [];
//             for (const like of likes) {
//                 likePostIdArray.push(like.postId);
//             }

//       let posts = await sequelize
//         .query(postsQuery, {
//           type: Sequelize.QueryTypes.SELECT,
//         })
//         .then((posts) => getPostsByPostIdArray(likePostIdArray, posts));

//         return likePostIdArray;
//       }

//       const likes = await Likes.findAll();

//       let posts = posts.map((post) => {
//         return {
//           ...post,
//           likes: likes.filter((like) => like.postId === post.postId).length,
//         };
//       });

//       posts.sort((a, b) => b.createdAt - a.createdAt);
//       posts.sort((a, b) => b.likes - a.likes);

//       return res.status(200).json({
//         data: posts,
//       });
//     } catch (error) {
//         console.log(error);
//       console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//       return res.status(400).json({
//         errorMessage: '좋아요 게시글 조회에 실패하였습니다.',
//       });
//     }
//   });

// router.put('/:postId/like', authMiddlewares, async (req, res) => {
//     // try {
//         const { postId } = req.params;
//         const { UserId } = res.locals.user;
//         // console.log(postId, UserId)
//         // const isExist = await Posts.findByPk(postId);
//         const isExist = await Posts.findOne({
//             where: {
//                 [Op.or] : [{postId : postId}]
//             },
//         });
        
//         if (!isExist) {
//           return res.status(404).json({
//             errorMessage: '게시글이 존재하지 않습니다.',
//           });
//         }
  
//         let isLike = await Likes.findOne({
//           where: { postId, UserId },
//         });
//         console.log(isLike);
//         res.send();
  
//         // if (!isLike) {
//         //   await Likes.create({ postId, UserId });
  
//         //   return res
//         //     .status(200)
//         //     .json({ message: '게시글의 좋아요를 등록하였습니다.' });
//         // } else {
//         //   await Likes.destroy({
//         //     where: { postId, UserId },
//         //   });
  
//         //   return res
//         //     .status(200)
//         //     .json({ message: '게시글의 좋아요를 취소하였습니다.' });
//         // }
//     //   } catch (error) {
//     //     console.log(error);
//     //     console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//     //     return res.status(400).json({
//     //       errorMessage: '게시글 좋아요에 실패하였습니다.',
//     //     });
//     // }
// });

module.exports = router;