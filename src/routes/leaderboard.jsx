import './leaderboard.css';
import TreeDisplayBanner from '../components/treeDisplayBanner.jsx'

function Leaderboard() {
	return (
		<div className="leaderboard-page-wrapper">
			I don't know where else to put this so heres a component that reads your tree selection from the database and displays it. Trees are selectable from the Edit Profile page.
			<TreeDisplayBanner/>
		</div>
	);
}

export default Leaderboard;
