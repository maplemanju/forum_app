'use client'

import { useState, useEffect } from 'react'
import { executeVote } from '@/process/actions/voteAction'
import { Button } from '@/components/atoms/button'
import { useLoginPopup } from '@/hooks/useLoginPopup'

type VoteButtonsProps = {
  postId?: number
  voteCount: number
  commentId?: number
  canVote?: boolean
  userVotes?: {
    vote: number
  }[]
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  postId,
  voteCount,
  commentId,
  canVote,
  userVotes,
}) => {
  const [voteCountState, setVoteCountState] = useState(voteCount)
  const [userVoteCount, setUserVoteCount] = useState(0)
  const { openLoginPopup, isOpen: isLoginPopupOpen } = useLoginPopup()

  useEffect(() => {
    if (userVotes && userVotes.length > 0) {
      setUserVoteCount(userVotes[0].vote)
    }
  }, [userVotes])

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!canVote) {
      if (!isLoginPopupOpen) {
        openLoginPopup()
      }
      return
    }
    const vote = voteType === 'upvote' ? 1 : -1
    const result = await executeVote({
      postId,
      commentId,
      vote,
    })
    console.log('result', result)
    if (result.success && result.voteCount !== undefined) {
      if (
        result.voteCount === 1 ||
        (userVoteCount === 1 && result.voteCount === -1)
      ) {
        // add/subtract vote
        setVoteCountState(voteCountState + result.voteCount)
      } else if (userVoteCount === 1 && result.voteCount === 0) {
        // remove upvote
        setVoteCountState(voteCountState - 1)
      }

      setUserVoteCount(result.voteCount)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* <span>{voteCountState}</span> */}
      <>
        <Button
          rightIcon="favorite"
          onClick={() => handleVote('upvote')}
          size={commentId ? 'xsmall' : 'small'}
          color="neutral"
          boxStyle="box"
          label={voteCountState.toString()}
          className={userVoteCount === 1 ? 'text-color-primary' : ''}
        />
        <Button
          rightIcon="question_mark"
          onClick={() => handleVote('downvote')}
          size={commentId ? 'xsmall' : 'small'}
          color="neutral"
          boxStyle="box"
          className={userVoteCount === -1 ? 'text-color-gray' : ''}
        />
      </>
    </div>
  )
}

export default VoteButtons
