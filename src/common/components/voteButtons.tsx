'use client'

import { startTransition, useEffect, useOptimistic, useState } from 'react'
import { executeVote } from '@/process/actions/voteAction'

type VoteButtonsProps = {
  postId?: number
  voteCount: number
  commentId?: number
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  postId,
  voteCount,
  commentId,
}) => {
  const [voteCountState, setVoteCountState] = useState(voteCount)

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    const vote = voteType === 'upvote' ? 1 : -1
    const result = await executeVote({
      postId,
      commentId,
      vote,
    })
    if (result.success && result.voteCount) {
      setVoteCountState(voteCountState + result.voteCount)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span>{voteCountState}</span>
      <span>Votes</span>
      <button onClick={() => handleVote('upvote')}>Upvote</button>
      <button onClick={() => handleVote('downvote')}>Downvote</button>
    </div>
  )
}

export default VoteButtons
