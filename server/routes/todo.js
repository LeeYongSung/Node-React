const express = require('express')
const Sequelize = require('sequelize');             // ✅ Sequelize 추가
const Todo = require('../models/todo')            // ✅ Todo 모델 import
const router = express.Router()

// 👩‍💻 게시글 목록
router.get('/', async (req, res) => {
    console.log('게시글 목록...');
    let todoList = []
    try {
        todoList = await Todo.findAll()           // ✅ 전체 데이터 조회
    } catch (error) {
        console.log(error);
    }

    res.json(todoList);
})

// 할 일 등록
router.post('/', async (req, res) => {
    console.log('할 일 등록...');
    // 구조분해할당
    const { name, status } = req.body;
    const newTodo = { name, status };

    try {
        const result = await Todo.create(newTodo)           // ✅ 데이터 등록
        console.log(result);
        
        // SequelizeInstance 객체를 JSON 형태로 변환
        const resultJson = result.toJSON();
        console.log(`등록 result : ${resultJson}`);
        
        // 클라이언트에게 JSON 형태로 반환
        res.json(resultJson);
        // res.redirect('/todos');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: '데이터 등록에 실패했습니다.' });
    }
});

// 👩‍💻 게시글 수정 페이지
router.get('/update/:id', async (req, res) => {
    console.log('게시글 수정 화면...');
    console.log(`id : ${req.params.id}`);
    let id = req.params.id
    let board = await Todo.findByPk(id)
    res.render('board/update', { board, id });
});

// 할 일 수정
router.put('/', async (req, res) => {
    console.log('게시글 수정...');
    const { no, name, status } = req.body;

    let result = 0
    try {
        if(no > 0) {
            result = await Todo.update({
                no: no,
                name: name,
                status: status
            }, {
                where: {no: no}
            })
        }
        if(no == -1) {
            result = await Todo.update({
                status: 1
            }, {
                where: {status : 0},
            })
        }
    } catch (error) {
        console.log(error);
    }
    console.log(`수정 result : ${result}`);
    res.redirect(`/todos`);
});

// 할 일 삭제
router.delete('/:no', async (req, res) => {
    console.log('할일 삭제...');
    const no = req.params.no;

    let result = 0
    try {
        if(no > 0) {
            result = await Todo.destroy({
                where: { no : no }
            })
        }
        if(no == -1) {
            result = await Todo.destroy({
                where: {}
            })
        }
    } catch (error) {
        console.log(error);
    }
    console.log(`삭제 result : ${result}`);

    res.redirect('/todos');
});

module.exports = router;