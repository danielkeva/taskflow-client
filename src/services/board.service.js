import HttpService from './http.service.js'
import { utilService } from './util.service.js'

export const boardService = {
    query,
    getById,
    update,
    save,
    getEmptyList,
    getEmptyCard,
    getEmptyCheckList,
    getEmptyListItem,
    newActivity,
    getActivities,
    addActivity,
    getEmptyBoard,
}

async function query() {
    // const params =  new URLSearchParams(userId)
    // console.log('params', params)
    return await HttpService.get('board')
}
async function getById(id) {
    return await HttpService.get(`board/${id}`)
}
async function update(board) {
    return HttpService.put(`board/${board._id}`, board)
}
async function save(board) {
    return HttpService.post('board', board)
}
function getActivities(boardId) {
    return HttpService.get(`activity/${boardId}`)
}
function addActivity(boardId, newActivity) {
    return HttpService.put(`activity/${boardId}`, newActivity)
}


function getEmptyBoard() {
    const newBoard = {
        style: {
            background: "#61bd4f",
            type: "color"
        },
        activities: [],
        privacy: '',
        users: [],
        cardLists: [getEmptyList()],
        labels: [
            {
                id: "label1xa",
                title: "",
                color: "#61bd4f"
            },
            {
                id: "label2xe",
                title: "",
                color: "#f2d600"
            },
            {
                id: "label3qza",
                title: "",
                color: "#ff9f1a"
            },
            {
                id: "label4qpa",
                title: "",
                color: "#c377e0"
            },
            {
                id: "label5uxa",
                title: "",
                color: "#eb5a46"
            },
            {
                id: "label6wwe",
                title: "",
                color: "#055a8c"
            },
            {
                id: "label7qioia",
                title: "",
                color: "#344563"
            },
            {
                id: "label8aaza",
                title: "",
                color: "#00c2e0"
            },
            {
                id: "label9wlza",
                title: "",
                color: "#ff78cb"
            }
        ],
    }

    return newBoard
}

function getEmptyList() {
    return {
        id: utilService.makeId(),
        title: '',
        theme: 'white',
        cards: []
    }
}
function getEmptyCard() {
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
        images: [],
        checklists: [],
        cover: {
            background: '',
            isFull: null,
            type: null
        }
    }
}

function getEmptyCheckList(title = 'Checklist') {
    return {
        id: utilService.makeId(),
        title,
        listItems: [],
    }
}

function getEmptyListItem() {
    return {
        id: utilService.makeId(),
        title: '',
        isDone: false
    }
}

function newActivity(cardTxt, boardTxt, cardId) {
    return {
        id: utilService.makeId(7),
        cardTxt, // text to display without link to the card
        boardTxt, // text to display with link to the card
        cardId,
        date: Date.now()
    }
}


// let board = {

//     theme: 'white',
//     id: 'board1',
//     userId: '',
//     users: [],
//     activities: [
//     ],

//     labels: [
//         {
//             id: 'label1xa',
//             title: 'a',
//             color: '#61bd4f',
//         },
//         {
//             id: 'label2xe',
//             title: '',
//             color: '#f2d600',
//         },
//         {
//             id: 'label3qza',
//             title: 'hii',
//             color: '#ff9f1a',
//         },
//         {
//             id: 'label4qpa',
//             title: '',
//             color: '#c377e0',
//         },
//         {
//             id: 'label5uxa',
//             title: '',
//             color: '#eb5a46',
//         },
//         {
//             id: 'label6wwe',
//             title: '',
//             color: '#055a8c',
//         },
//         {
//             id: 'label7qioia',
//             title: '',
//             color: '#344563',
//         },
//         {
//             id: 'label8aaza',
//             title: '',
//             color: '#00c2e0',
//         },
//         {
//             id: 'label9wlza',
//             title: '',
//             color: '#ff78cb',
//         },
//     ],
//     cardLists: [
//         {
//             id: 'list1',
//             title: 'This is the list title',
//             theme: 'white',
//             cards: [
//                 {
//                     cardListId: 'list1',
//                     id: 'card1',
//                     title: 'This is the card title',
//                     description: 'This is the card description',
//                     creatorId: '',
//                     membersId: [],
//                     comments: [],
//                     dueDate: '',
//                     labels: [],
//                     isDone: false,
//                     attachment: '',
//                     checklists: []
//                 },

//                 {
//                     cardListId: 'list1',
//                     id: 'card2',
//                     title: 'This is the card title',
//                     description: 'This is the card description',
//                     creatorId: '',
//                     membersId: [],
//                     comments: [],
//                     dueDate: '',
//                     labels: [],
//                     isDone: false,
//                     attachment: '',
//                     checklists: []
//                 },

//                 {
//                     cardListId: 'list1',
//                     id: 'card3',
//                     title: 'This is the card title',
//                     description: 'This is the card description',
//                     creatorId: '',
//                     membersId: [],
//                     comments: [],
//                     dueDate: '',
//                     labels: [],
//                     isDone: false,
//                     attachment: '',
//                     checklists: []
//                 },

//                 {
//                     cardListId: 'list1',
//                     id: 'card4',
//                     title: 'This is the card title',
//                     description: 'This is the card description',
//                     creatorId: '',
//                     membersId: [],
//                     comments: [],
//                     dueDate: '',
//                     labels: [],
//                     isDone: false,
//                     attachment: '',
//                     checklists: []
//                 },

//             ]
//         },
//     ]

// }

async function stall(stallTime = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
  }