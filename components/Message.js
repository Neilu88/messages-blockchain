const Message = ({ sender, message, timestamp }) => {
  if (message === "") {
    return
  }
  return (
    <div className="m-10 flex items-center justify-between space-x-4 rounded-md bg-gradient-to-l from-green-200 via-green-300 to-blue-500 p-10">
      <h1 className="font-bold">
        {sender.substring(0, 5) + "..." + sender.slice(-4)}
      </h1>
      <h1 className="font-bold">{message}</h1>
      <h1 className="font-bold">{timestamp.toString()}</h1>
    </div>
  )
}
export default Message
