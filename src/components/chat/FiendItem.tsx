interface Props {
  friend: {
    uid: string
    displayName: string
    photoURL: string
    lastMessage: string
  }
}

export const FiendItem = ({ friend }: Props) => {
  return (
    <article className="flex gap-x-2 items-center py-2 px-3 border-b hover:bg-gray-100 cursor-pointer">
        <img 
            src={friend.photoURL}
            alt={friend.displayName}
            className="w-12 h-12 rounded-md"
        />
        <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-800">{friend.displayName}</h3>
            <p className="text-xs truncate">{friend.lastMessage}</p>
        </div>
    </article>
  )
}
