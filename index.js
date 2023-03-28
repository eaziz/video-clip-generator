// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const natural = require('natural');
const similarity = require('string-cosine-similarity')


// Create an instance of the Express.js application
const app = express();

// Configure the application to use JSON-encoded request bodies
app.use(bodyParser.json());

// Serve the static files in the public directory
app.use(express.static('public'));

// Define a route to handle POST requests from the UI
app.post('/process-text', (req, res) => {
  // Extract the summary and context from the request body
  let summary = req.body.summary;
  let context = req.body.context;
  // summary = summary.replace(/\n+/g, ' ').trim().toLowerCase();;
  // context = context.replace(/\n+/g, ' ').trim().toLowerCase();;
  // summary = summary.replace(regex, '').toLowerCase();
  // context = context.replace(regex, '').toLowerCase();

  //console.log('summary:', summary);
  //console.log('context:', context);


  // Extract sentences from the context
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(context);

//const wordTokenizer = new natural.WordTokenizer();

  // Extract sentences from the summary
  const sentenceTokenizer = new natural.SentenceTokenizer();
  const summarySentences = sentenceTokenizer.tokenize(summary);

  // Check for matching sentences
  const matchingSentences = [];
  summarySentences.forEach(summarySentence => {
    //console.log('| Summary sentence:', summarySentence);
    let maxRelevance = 0;
    let cosineSimilarity = 0;
    let bestMatch = '';
    sentences.forEach(sentence => {
      const relevance = natural.JaroWinklerDistance(summarySentence.toLowerCase(), sentence.toLowerCase(),{ignoreCase:true});
      if(sentence.toLowerCase().includes('DeSantis has been all over the news this week as he is seemingly every week'.toLowerCase())
       && summarySentence.toLowerCase().includes('Ron DeSantis has been all over the news this week'.toLowerCase()) ){
        console.log('--------------------------------');
        console.log('| relevance: ',relevance);
        console.log(summarySentence);
        console.log(sentence);
        let cosineSimilarity = similarity(summarySentence,sentence);
        console.log('cosing similarity:',cosineSimilarity);


        console.log('--------------------------------');

      }

      // const relevance = natural.LevenshteinDistance(summarySentence.toLowerCase(), sentence.toLowerCase(),);

      // const vector1 = new natural.TfIdf().addDocument(summarySentence).idf;
      // const vector2 = new natural.TfIdf().addDocument(sentence).idf;

      // const cosineSimilarity = natural.VectorSpaceUtils.cosineSimilarity(vector1, vector2);
      // console.log('Cosing similarity', cosineSimilarity);


        cosineSimilarity = similarity(summarySentence,sentence);
        if(cosineSimilarity>maxRelevance){
          console.log('cosineSimilarity ss',cosineSimilarity);
          maxRelevance = cosineSimilarity;
          bestMatch = sentence;
        }

      // if (relevance > maxRelevance) {
      //   maxRelevance = relevance;
      //   bestMatch = sentence;
      // }

    });
        console.log('| relevance: ',maxRelevance);
        console.log("! sumary sentence", summarySentence);
        console.log("| context sentence: ", bestMatch);
        // let cosineSimilarity = similarity(summarySentence,bestMatch);
        // console.log('cosing similarity:',cosineSimilarity);

    // if (maxRelevance > 0.7) {
    //   console.log('Best matching sentence', bestMatch);
      matchingSentences.push('['+summarySentence+'|'+ bestMatch+']');
    // }
  });
  //console.log(matchingSentences); 
  res.json({ matchingSentences });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000!');
});
