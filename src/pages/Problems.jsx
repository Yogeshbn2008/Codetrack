import ProblemCard from '../components/ProblemCard'

function Problems({ problems, onDelete }) {

  return (
    <div>
      <h2>My Problems</h2>
      {problems.length === 0 ? (
        <p>No problems yet. Add one!</p>
      ) : (
        problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}

export default Problems