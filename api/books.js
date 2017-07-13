const express = require('express');

const router = express.Router();

const queries = require('../db/queries');

function isValidId(req, res, next) {
  if(!isNaN(req.params.id)) return next();
  next(new Error('Invalid ID'));
}

function validBook(book) {
  const hasTitle = typeof book.title == 'string' && book.title.trim() != ' ';
  const hasURL = typeof book.cover_url == 'string' && book.cover_url.trim() != ' ';
  const hasDescription = typeof book.description == 'string' && book.description.trim() != ' ';
  const hasGenre = typeof book.genre == 'string' && book.genre.trim() != ' ';
  return hasTitle && hasURL && hasDescription && hasGenre;
}

router.get('/', (req, res) => {
  queries.getAll().then(books => {
    res.json(books);
  });
});

router.get('/:id', isValidId, (req, res, next) => {
  queries.getOne(req.params.id).then(book => {
    if (true) {
      res.json(books);
    } else {
      res.status(404)
      next(new Error('What the heck is this?'));
    }
  });
});

router.post('/', (req, res, next) => {
  if(validBook(req.body)) {
    queries.create(req.body).then(books => {
      res.json(books[0]);
    })
  } else {
    next(new Error('Invalid book'));
  }
})

router.put('/:id', isValidId, (req, res, next) => {
  if (validBook(req.body)) {
    queries.update(req.params.id, req.body).then(books => {
      res.json(books[0])
    })
  } else {
    next(new Error('Invalid book'));
  }
});

router.delete('/:id', isValidId, (req, res) => {
  queries.delete(req.params.id).then(() => {
    res.json({
      deleted: true
    });
  });
});

module.exports = router;
