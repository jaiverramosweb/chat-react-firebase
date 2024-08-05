interface Props {
    imageURL: string
    message: string
    date: string
    position?: boolean
}

const Messaje = ({ message, date, position = false, imageURL }: Props) => {
  return (
    <article className={`flex gap-x-2 gap-y-4 p-2 ${position ? "flex-row-reverse" : ""}`}>
        <img className="rounded-full size-10" src={imageURL} alt="img" />

        <div className={`p-2 rounded-md shadow-md max-w-[70%] ${position ? "bg-green-200" : "bg-white"}`}>                    
            <p className="text-gray-700">{message}</p>
            <p className="text-right text-gray-500">{date}</p>
        </div>
    </article>
  )
}

export default Messaje