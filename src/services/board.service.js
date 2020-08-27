import HttpService from './http.service.js'
import { utilService } from './util.service.js'
let board = {

    theme: 'white',
    id: 'board1',
    userId: '',
    users: [],
    activities: [
    ],

    labels: [
        {
            id: 'label1xa',
            title: 'a',
            color: '#61bd4f',
        },
        {
            id: 'label2xe',
            title: '',
            color: '#f2d600',
        },
        {
            id: 'label3qza',
            title: 'hii',
            color: '#ff9f1a',
        },
        {
            id: 'label4qpa',
            title: '',
            color: '#c377e0',
        },
        {
            id: 'label5uxa',
            title: '',
            color: '#eb5a46',
        },
        {
            id: 'label6wwe',
            title: '',
            color: '#055a8c',
        },
        {
            id: 'label7qioia',
            title: '',
            color: '#344563',
        },
        {
            id: 'label8aaza',
            title: '',
            color: '#00c2e0',
        },
        {
            id: 'label9wlza',
            title: '',
            color: '#ff78cb',
        },
    ],
    taskLists: [
        {
            id: 'list1',
            title: 'This is the list title',
            theme: 'white',
            tasks: [
                {
                    taskListId: 'list1',
                    id: 'task1',
                    title: 'This is the task title',
                    description: 'This is the task description',
                    creatorId: '',
                    membersId: [],
                    comments: [],
                    dueDate: '',
                    labels: [],
                    isDone: false,
                    attachment: '',
                    checklists: []
                },

                {
                    taskListId: 'list1',
                    id: 'task2',
                    title: 'This is the task title',
                    description: 'This is the task description',
                    creatorId: '',
                    membersId: [],
                    comments: [],
                    dueDate: '',
                    labels: [],
                    isDone: false,
                    attachment: '',
                    checklists: []
                },

                {
                    taskListId: 'list1',
                    id: 'task3',
                    title: 'This is the task title',
                    description: 'This is the task description',
                    creatorId: '',
                    membersId: [],
                    comments: [],
                    dueDate: '',
                    labels: [],
                    isDone: false,
                    attachment: '',
                    checklists: []
                },

                {
                    taskListId: 'list1',
                    id: 'task4',
                    title: 'This is the task title',
                    description: 'This is the task description',
                    creatorId: '',
                    membersId: [],
                    comments: [],
                    dueDate: '',
                    labels: [],
                    isDone: false,
                    attachment: '',
                    checklists: []
                },

            ]
        },
    ]

}
export const boardService = {
    query,
    save,
    getById,
    getTaskById,
    getEmptyList,
    getEmptyTask,
    getEmptyCheckList,
    getEmptyListItem,
    newActivity
}

// function query() {
//     return board
// }


function query() {
    return HttpService.get('board')
}

async function getById(id) {
    const currBoard = await HttpService.get(`board/${id}`)
    return currBoard
}

function getTaskById(taskId) {
    for (let i = 0; i < board.taskLists.length; i++) {
        var task = board.taskLists[i].tasks.find(task => task.id === taskId)
        if (task) {
            return task
        }
    }
}

function save(newBoard) {
    board = newBoard
    return JSON.parse(JSON.stringify(board))
}

function getEmptyList() {
    return {
        id: utilService.makeId(),
        title: '',
        theme: 'white',
        tasks: []
    }
}

function getEmptyTask() {
    return {
        id: utilService.makeId(),
        title: '',
        description: '',
        creatorId: '',
        membersId: [],
        comments: [],
        dueDate: '',
        labels: [],
        isDone: false,
        attachment: '',
        checklists: []
    }
}
function getEmptyCheckList(title = 'Checklist') {
    return {
        id: utilService.makeId(),
        title,
        listItems: []
    }
}
function getEmptyListItem() {
    return {
        id: utilService.makeId(),
        title: '',
        isDone: false
    }
}

function newActivity(cardTxt, boardTxt, taskId) {
    return {
        id: utilService.makeId(),
        cardTxt, // text to display without link to the card
        boardTxt, // text to display with link to the card
        taskId,
        date: Date.now()
    }
}