module.exports = {
    openapi: '3.0.1',
    info: {
      version: '1.3.0',
      title: 'Staclone',
      description: 'A simple clone of stackoverflow',
      contact: {
        name: 'jumoke',
        email: 'jumoke5ng@yahoo.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Local server'
      },
      {
        url: 'https://staclone.herokuapp.com/',
        description: 'Production server'
      }
    ],
    security: [
      {
        BearerAuth: []
      }
    ],
    paths: {
      '/api/v1/user/signup': {
        post: {
          tags: ['Users'],
          description: 'User Signup',
          operationId: 'create',
          parameters: [
            {
              name: 'email',
              in: 'body',
              required: true
            },
            {
              name: 'password',
              in: 'body',
              required: true
            },
            {
              name: 'fullName',
              in: 'body',
              required: true
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Users'
                }
              }
            },
            required: true
          },
          responses: {
            '200': {
              description: 'User successfully signed up',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Users'
                  },
                  example: {
                    message: 'User successfully signed up',
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388'
                      }
                    }, 
                    token: '2438348434'
                  }
                }
              }
            },
            '422': {
              description: 'Incomplete input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: { "email": "You must enter an email address." }
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: 'error signing up',
                  },
                }
              }
            }
          }
        },
      },
      '/api/v1/user/signin': {
        post: {
          tags: ['Users'],
          description: 'User Signin',
          operationId: 'sign in',
          parameters: [
            {
              name: 'email',
              in: 'body',
              required: true
            },
            {
              name: 'password',
              in: 'body',
              required: true
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Users'
                }
              }
            },
            required: true
          },
          responses: {
            '200': {
              description: 'User successfully signed in',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Users'
                  },
                  example: {
                    message: 'User successfully signed up',
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388'
                      }
                    }, 
                    token: '2438348434'
                  }
                }
              }
            },
            '422': {
              description: 'Incomplete input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: { "email": "You must enter an email address." }
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: 'error signing in',
                  },
                }
              }
            }
          }
        },
      },
      '/api/v1/users/search?=searchItem': {
        get: {
          tags: ['Users'],
          description: 'User Search',
          operationId: 'user search',
          parameters: [
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Users'
                }
              }
            },
          },
          responses: {
            '200': {
              description: 'User search successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Users'
                  },
                  example: {
                    data: [{
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388'
                      }
                    }]
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: 'error getting users',
                  },
                }
              }
            }
          }
        }
      },
      '/api/v1/questions': {
        post: {
          tags: ['Questions'],
          description: 'Post Questions',
          operationId: 'create',
          parameters: [
            {
              name: 'query',
              in: 'body',
              required: true
            },
            {
              name: 'tag',
              in: 'body',
              required: true
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
            required: true
          },
          responses: {
            '200': {
              description: 'Question successfully created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    message: 'Question successfully created',
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388',
                        createdAt: "2020-05-12T05:43:20.458Z",
                        updatedAt: "2020-05-12T05:43:20.458Z"
                      },                    
                      answers: [],
                      voteCount: -1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }
                  }
                }
              }
            },
            '422': {
              description: 'no input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: 'need to ask a question',
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: 'error saving question',
                  }
                }
              }
            }
          }
        },
        get: {
          tags: ['Questions'],
          description: 'Get All Questions',
          operationId: 'getAll',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
          },
          responses: {
            '200': {
              description: 'Questions successfully returned',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    data: [ {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388',
                        createdAt: "2020-05-12T05:43:20.458Z",
                        updatedAt: "2020-05-12T05:43:20.458Z"
                      },                    
                      answers: [
                        {
                            _id: "5eba37781",
                            answer: "index of an array",
                            user: "5eb1b484776f1538fce5ea50",
                            createdAt: "2020-05-12T05:43:20.458Z",
                            updatedAt: "2020-05-12T05:43:20.458Z"
                        }
                      ],
                      voteCount: -1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }]
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    data: 'error getting questions',
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/question': {

      },
      '/api/v1/question/:questionId': {
        get: {
          tags: ['Questions'],
          description: 'Get Single Question',
          operationId: 'get',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
          },
          responses: {
            '200': {
              description: 'Question successfully updated',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388',
                        createdAt: "2020-05-12T05:43:20.458Z",
                        updatedAt: "2020-05-12T05:43:20.458Z"
                      },                    
                      answers: [
                        {
                            _id: "5eba37781",
                            answer: "index of an array",
                            user: "5eb1b484776f1538fce5ea50",
                            createdAt: "2020-05-12T05:43:20.458Z",
                            updatedAt: "2020-05-12T05:43:20.458Z"
                        }
                      ],
                      voteCount: -1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    data: 'error getting question',
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/question/:questionId/upvote': {
        put: {
          tags: ['Questions'],
          description: 'Upvote Single Question',
          operationId: 'upvote',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
          },
          responses: {
            '200': {
              description: 'Question successfully updated',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    message: 'Question successfully upvoted',
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388',
                        createdAt: "2020-05-12T05:43:20.458Z",
                        updatedAt: "2020-05-12T05:43:20.458Z"
                      },                    
                      answers: [],
                      voteCount: 1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    data: 'error upvoting question',
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/question/:questionId/downvote': {
        put: {
          tags: ['Questions'],
          description: 'Downvote Single Question',
          operationId: 'downvote',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
          },
          responses: {
            '200': {
              description: 'Question successfully updated',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    message: 'Question successfully downvoted',
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388',
                        createdAt: "2020-05-12T05:43:20.458Z",
                        updatedAt: "2020-05-12T05:43:20.458Z"
                      },                    
                      answers: [],
                      voteCount: -1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    data: 'error downvoting question',
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/question/:questionId/answer': {
        get: {
          tags: ['Questions'],
          description: 'Answer A Question',
          operationId: 'answer a question',
          parameters: [
            {
              name: 'answer',
              in: 'body',
              required: true
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
            required: true
          },
          responses: {
            '200': {
              description: 'Question successfully updated',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    message: 'Question successfully answered',
                    data: {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388'
                      },                    
                      answers: [
                        {
                            _id: "5eba37781",
                            answer: "index of an array",
                            user: "5eb1b484776f1538fce5ea50",
                            createdAt: "2020-05-12T05:43:20.458Z",
                            updatedAt: "2020-05-12T05:43:20.458Z"
                        }
                      ],
                      voteCount: -1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    message: 'error updating question',
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/filter?search=searchTerm': {
        get: {
          tags: ['Questions'],
          description: 'Search All Questions',
          operationId: 'search questions',
          parameters: [],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Questions'
                }
              }
            },
          },
          responses: {
            '200': {
              description: 'Questions successfully returned',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Questions'
                  },
                  example: {
                    data: [ {
                      query: 'test',
                      tag: 'done',
                      _id: 'wqew1233',
                      user: {
                        _id: '232344',
                        email: 'joy@gmail.com',
                        fullName: 'joy don',
                        password: '$wtytwe3388',
                        createdAt: "2020-05-12T05:43:20.458Z",
                        updatedAt: "2020-05-12T05:43:20.458Z"
                      },                    
                      answers: [
                        {
                            _id: "5eba37781",
                            answer: "index of an array",
                            user: "5eb1b484776f1538fce5ea50",
                            createdAt: "2020-05-12T05:43:20.458Z",
                            updatedAt: "2020-05-12T05:43:20.458Z"
                        }
                      ],
                      voteCount: -1,
                      createdAt: "2020-05-12T05:43:20.458Z",
                      updatedAt: "2020-05-12T05:43:20.458Z"
                    }]
                  }
                }
              }
            },
            '500': {
              description: 'Error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  },
                  example: {
                    data: 'error getting questions',
                  }
                }
              }
            }
          }
        }
      },
    },
    components: {
      schemas: {
        Answer: {
          type: 'object',
          properties: {
            _id: {
              type: 'integer',
              description: 'identification number',
              example: 1234
            },
            answer: {
              type: 'string',
              description: 'Question answer',
            },
            user: {
              type: 'object',
              $ref: '#/components/schemas/User'
            },
          }
        },
        Question: {
          type: 'object',
          properties: {
            _id: {
              type: 'integer',
              description: 'identification number',
              example: 1234
            },
            query: {
              type: 'string',
              description: 'Question to ask',
              example: 'how to build an app'
            },
            tag: {
              type: 'string',
              description: 'Question tag',
              example: 'javascript'
            },
            voteCount: {
              type: 'integer',
              description: 'vote count(upvotes - downvotes)',
              example: 1
            },
            answers: {
              type: 'array',
              properties: {
                answer: {
                  type: 'object',
                  items: {
                    $ref: '#/components/schemas/Answer'
                  }
                }
              }
            },
            user: {
              type: 'object',
              $ref: '#/components/schemas/User'
            },
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'integer',
              description: 'User identification number',
              example: 1234
            },
          fullName: {
              type: 'string',
              example: 'tim'
            },
            email: {
              type: 'string',
              example: 'tim'
            },
            password: {
              type: 'string',
              description: 'User Password',
              example: 'erkerkkre223'
            },
          }
        },
        Users: {
          type: 'array',
          properties: {
            user: {
              type: 'object',
              items: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            data: {
              type: 'string'
            },
          }
        },
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
    },
  }
};
 
       /* ... */
