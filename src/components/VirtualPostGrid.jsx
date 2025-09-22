import { memo, useMemo } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import PostCard from './PostCard'

const VirtualPostGrid = memo(({ posts, width = 1200, height = 600 }) => {
  const COLUMN_WIDTH = 400
  const ROW_HEIGHT = 500
  const GUTTER_SIZE = 20

  const { columnCount, rowCount } = useMemo(() => {
    const cols = Math.floor(width / (COLUMN_WIDTH + GUTTER_SIZE))
    const rows = Math.ceil(posts.length / cols)
    return { columnCount: cols, rowCount: rows }
  }, [posts.length, width])

  const Cell = memo(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex
    const post = posts[index]

    if (!post) return null

    return (
      <div
        style={{
          ...style,
          left: style.left + GUTTER_SIZE / 2,
          top: style.top + GUTTER_SIZE / 2,
          width: style.width - GUTTER_SIZE,
          height: style.height - GUTTER_SIZE,
        }}
      >
        <PostCard post={post} />
      </div>
    )
  })

  Cell.displayName = 'Cell'

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts found</p>
      </div>
    )
  }

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
      height={height}
      rowCount={rowCount}
      rowHeight={ROW_HEIGHT + GUTTER_SIZE}
      width={width}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {Cell}
    </Grid>
  )
})

VirtualPostGrid.displayName = 'VirtualPostGrid'

export default VirtualPostGrid