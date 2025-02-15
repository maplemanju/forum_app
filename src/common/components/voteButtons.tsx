'use client'

import { useState } from 'react'
import { executeVote } from '@/process/actions/voteAction'
import { Button } from '@/common/components/button'

type VoteButtonsProps = {
  postId?: number
  voteCount: number
  commentId?: number
  canVote?: boolean
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  postId,
  voteCount,
  commentId,
  canVote,
}) => {
  const [voteCountState, setVoteCountState] = useState(voteCount)

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!canVote) {
      alert('Please login to vote')
      return
    }
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
      <>
        <Button
          rightIcon="thumb_up"
          onClick={() => handleVote('upvote')}
          size="small"
          color="neutral"
          boxStyle="box"
        />
        <Button
          rightIcon="thumb_down"
          onClick={() => handleVote('downvote')}
          size="small"
          color="neutral"
          boxStyle="box"
        />
      </>
    </div>
  )
}

export default VoteButtons
