const WordList = ({ words }) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
      {words.map((word) => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  )
}

export default WordList
