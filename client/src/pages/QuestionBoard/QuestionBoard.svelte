<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import io from 'socket.io-client';
    import { authStore } from '../../store/authStores';
    import { BASE_URL } from '../../store/globalStores';
  
    const socket = io(`${$BASE_URL}`);
    const questions = writable([]);
    export const questionInput = writable('');
    export const answerInput = writable('');
  
onMount( async () => {
    const response = await fetch(`${$BASE_URL}/questions`, {credentials: 'include'});
    let receivedQuestions = await response.json();
    receivedQuestions.sort( (a, b) => new Date(b.date) - new Date(a.date) );
    questions.set(receivedQuestions);

    socket.on('newQuestion', (data) => {
        questions.update((existingQuestions) => [data, ...existingQuestions]);
    });
  
    socket.on('newAnswer', (data) => {
        questions.update((existingQuestions) => {
            const updatedQuestionIndex = existingQuestions.findIndex((question) => question._id === data.questionId);

            if (updatedQuestionIndex !== -1) {
                const updatedQuestion = { ...existingQuestions[updatedQuestionIndex] };
                if (!Array.isArray(updatedQuestion.answers)) {
                    updatedQuestion.answers = [];
                }

                updatedQuestion.answers.push({ user: data.user, text: data.text });

                // Replaces the array for Svelte to recognize the update
                existingQuestions = [
                    ...existingQuestions.slice(0, updatedQuestionIndex),
                    updatedQuestion,
                    ...existingQuestions.slice(updatedQuestionIndex + 1),
                ];
            }
            return existingQuestions;
        });
    });
});

    function askQuestion() {
        const data = { user: $authStore.username, text: $questionInput, date: new Date(), answers: [] };
        socket.emit('question', data);
        questionInput.set('');
    }
  
    function postAnswer(questionId) {
        const data = {  user: $authStore.username, questionId: questionId, text: $answerInput };
        socket.emit('answer', data);
        answerInput.set('');
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('en-UK', options);   
    }
</script>
  
<main>
  <h1>Question Board</h1>
  <div class="question-board-container">
      <form on:submit|preventDefault={askQuestion}>
          <h3> Ask a question to the comunity: </h3>
          <textarea class="input-field" placeholder="Ask your question..." bind:value={$questionInput} name="question" />
          <button class="submit-button" type="submit">Ask</button>
      </form> 
  {#if $questions.length === 0}
    <p>No questions yet.</p>
  {:else}
    {#each $questions as question}
      <div class="question">
          <h3 class="margin-left">{question.user} asks:</h3>
          <p class="margin-left">{question.text}</p>
          <p class="margin-left highlight-username">{formatDate(question.date)}</p>
          <button class="show-answer-button" on:click={() => question.open = !question.open}>
            {question.open ? "Hide answers" : "Show answers"}
          </button>

        {#if question.open}
          {#if question.answers === undefined || question.answers.length === 0}
              <p>No answers yet.</p>
          {:else}
              {#each question.answers as answer}
              <div class="answer">
                  <p class="highlight-username">{answer.user}</p>
                  <p>{answer.text}</p>
              </div>
              {/each}
          {/if}

          <form on:submit|preventDefault={() => postAnswer(question._id)}>
            <h3>Give answer:</h3>
            <textarea class="input-field" bind:value={$answerInput} name={'answer-' + question._id} />
            <button class="submit-button" type="submit">Post</button>
          </form>
        {/if}
      </div>
    {/each}
  {/if}
  </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
    }

    form {
        text-align: center;
        display: flex;
        align-items: center;  
        margin-bottom: 5px;
    }

    h1 {
        text-align: center;
    }

    h3 {
        margin-right: 20px;
    }

    .highlight-username {
        font-weight: bold;

    }

    .margin-left {
        margin-left: 20px;
    }

    .show-answer-button {
        color: blue;
        background-color: white;
        margin-left: 0;
    }

    .question-board-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 60px;
    }

    .question {
        width: 80vw;
        padding: 1rem;
        border: 1px solid black;
        border-radius: 15px;
    }

    .answer {
        margin: 10px 0;
        padding: 10px;
        border: 1px solid grey;
        border-radius: 10px;
    }

    .input-field {
        font-size: 18px;
        padding: 10px;
        width: 300px;
        border-radius: 5px;
        transition: all 0.3s ease;
        background-color: #f0f8ff;
        border: 1px solid #8ac6d1;
        color: black;
    }

    .input-field:focus {
        border-color: #007BFF;
        box-shadow: 0 0 10px #A8E6CF;
    }

    .submit-button {
        margin-top: 10;
        margin-left: 25px;
        padding: 10px 20px;
        font-size: 18px;
        border-radius: 5px;
        border: none;
        color: #333333;
        background-color: #A8E6CF;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .submit-button:hover {
        background-color: #a8cbe6;
    }

</style>