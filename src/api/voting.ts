import { client } from './client';

export interface VoteTopic {
  voting_topic_id: string;
  topic: string;
  status: string;
}

export interface VoteOption {
  voting_option_id: string;
  name: string;
  vote_count?: number;
}

export const votingApi = {
  fetchVotes() {
    return client.get<{ voting_topics: VoteTopic[] }>('/votes');
  },
  fetchOptions(topicId: string) {
    return client.get<{ vote_options: VoteOption[] }>(`/votes/option/${topicId}`);
  },
  vote(topicId: string, selectedId: string) {
    return client.post(`/votes/student/${topicId}`, { query: { 'selected-id': selectedId } });
  },
  cancelVote(voteId: string) {
    return client.delete(`/votes/student/${voteId}`);
  },
};
