import Tree1 from '../assets/tree.png'
import Tree2 from '../assets/tree2.png'
import Sapling1 from '../assets/seedling.png'
import Sapling2 from '../assets/seedling2.png'

/* provides a standard way of inheriting trees so that all components
  that deal with the tree graphics agree on which graphic is which while
  still only identifying trees with integers for simplicity. I know
  its a bit unconventional, but all graphics for trees are 300x300. */

const treeImages = [
  {tree:Tree1, sapling:Sapling1},
  {tree:Tree2, sapling:Sapling2}
]

export default treeImages;