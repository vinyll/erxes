import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';
import { queries, mutations } from '../../graphql';
import Spinner from '@erxes/ui/src/components/Spinner';
import { Alert, confirm } from '@erxes/ui/src/utils';
import Bulk from '@erxes/ui/src/components/Bulk';
import List from '../../components/quiz/QuizList';
import { IQuiz } from '../../types';

const QuizList = () => {
  const { data, loading, error } = useQuery(gql(queries.quizzesList), {
    fetchPolicy: 'network-only',
    variables: {
      sort: {
        _id: -1
      }
    }
  });

  const [mutDelete] = useMutation(gql(mutations.deleteQuiz), {
    refetchQueries: ['ForumQuizzes']
  });

  const deleteQuiz = async (id: string, emptyBulk?: () => void) => {
    if (emptyBulk) {
      mutDelete({ variables: { id } })
        .then(() => emptyBulk())
        .catch(e => Alert.error(e.message));
    } else {
      confirm('Are you sure?')
        .then(() =>
          mutDelete({ variables: { id } }).catch(e => Alert.error(e.message))
        )
        .catch(e => Alert.error(e.message));
    }
  };

  if (loading) {
    return <Spinner objective={true} />;
  }

  if (error) {
    Alert.error(error.message);
  }

  const content = props => {
    return (
      <List
        {...props}
        quizzes={data?.forumQuizzes || ([] as IQuiz)}
        history={history}
        remove={deleteQuiz}
      />
    );
  };
  return <Bulk content={content} />;
};

export default QuizList;
