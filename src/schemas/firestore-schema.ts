export interface UserRooms {
    roomId: string
    lastMessage: string
    timestamp: string
    fiendId: string
}

export interface UserDB {
    displayName: string
    email: string
    photoURL: string
    uid: string
    firends: string[]
    rooms: UserRooms[]
}

export interface Message {
    readonly: string
    lastMessage: string
    timestamp: string
    uid: string
}

export interface RoomDB {
    messages: Message[]
    users: string[]
}