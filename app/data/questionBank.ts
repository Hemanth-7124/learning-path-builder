import type { Question } from '~/types'

export const questionBank: Question[] = [
  // Web Development - General Questions (can be used by any Web Development module)
  {
    id: 'web-general-001',
    text: 'What does HTML stand for?',
    category: 'Web Development',
    difficulty: 'Beginner',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlinks and Text Markup Language'
    ],
    correctAnswer: 0,
    explanation: 'HTML stands for Hyper Text Markup Language and is the standard markup language for creating web pages.'
  },
  {
    id: 'web-general-002',
    text: 'Which CSS property is used to change the background color of an element?',
    category: 'Web Development',
    difficulty: 'Beginner',
    options: [
      'color',
      'background-color',
      'bg-color',
      'background'
    ],
    correctAnswer: 1,
    explanation: 'The background-color property is used to set the background color of an HTML element.'
  },
  {
    id: 'web-beg-003',
    text: 'What is the purpose of JavaScript in web development?',
    category: 'Web Development',
    difficulty: 'Beginner',
    options: [
      'To style web pages',
      'To create database structures',
      'To add interactivity and dynamic behavior',
      'To manage server-side operations'
    ],
    correctAnswer: 2,
    explanation: 'JavaScript is primarily used to add interactivity and dynamic behavior to web pages.'
  },
  {
    id: 'web-beg-004',
    text: 'Which HTML tag is used to create a hyperlink?',
    category: 'Web Development',
    difficulty: 'Beginner',
    options: [
      '<link>',
      '<hyperlink>',
      '<a>',
      '<href>'
    ],
    correctAnswer: 2,
    explanation: 'The <a> tag (anchor tag) is used to create hyperlinks in HTML.'
  },
  {
    id: 'web-beg-005',
    text: 'What does CSS stand for?',
    category: 'Web Development',
    difficulty: 'Beginner',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswer: 1,
    explanation: 'CSS stands for Cascading Style Sheets and is used to describe the presentation of HTML documents.'
  },

  // Web Development - Intermediate
  {
    id: 'web-int-001',
    text: 'What is the purpose of the box model in CSS?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    options: [
      'To create 3D visual effects',
      'To define how elements are structured and spaced',
      'To organize CSS files',
      'To handle responsive layouts'
    ],
    correctAnswer: 1,
    explanation: 'The CSS box model defines how the content, padding, border, and margin of an element are structured and spaced.'
  },
  {
    id: 'web-int-002',
    text: 'Which JavaScript method is used to add an element to the end of an array?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    options: [
      'push()',
      'add()',
      'append()',
      'insert()'
    ],
    correctAnswer: 0,
    explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
  },
  {
    id: 'web-int-003',
    text: 'What is the difference between == and === in JavaScript?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    options: [
      '== checks for type, === checks for value',
      '== checks for value only, === checks for both value and type',
      '=== is faster than ==',
      'There is no difference'
    ],
    correctAnswer: 1,
    explanation: '== checks for equality with type coercion, while === checks for strict equality without type coercion.'
  },
  {
    id: 'web-int-004',
    text: 'Which CSS property is used to create flexible layouts?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    options: [
      'grid',
      'flex',
      'layout',
      'display-flex'
    ],
    correctAnswer: 1,
    explanation: 'The flex property (used with display: flex) creates flexible layouts that can adapt to different screen sizes.'
  },
  {
    id: 'web-int-005',
    text: 'What is the purpose of the DOM in web development?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    options: [
      'To store data on the server',
      'To represent HTML documents as a tree structure',
      'To manage CSS styles',
      'To handle network requests'
    ],
    correctAnswer: 1,
    explanation: 'The Document Object Model (DOM) represents HTML and XML documents as a tree structure that can be manipulated with JavaScript.'
  },

  // Web Development - Advanced
  {
    id: 'web-adv-001',
    text: 'What is the purpose of Web Components?',
    category: 'Web Development',
    difficulty: 'Advanced',
    options: [
      'To optimize website performance',
      'To create reusable custom elements',
      'To improve SEO rankings',
      'To handle database operations'
    ],
    correctAnswer: 1,
    explanation: 'Web Components allow developers to create reusable, encapsulated custom HTML elements with their own functionality.'
  },
  {
    id: 'web-adv-002',
    text: 'What is the Virtual DOM in React?',
    category: 'Web Development',
    difficulty: 'Advanced',
    options: [
      'A backup of the real DOM',
      'A JavaScript representation of the DOM',
      'A database for storing DOM elements',
      'A CSS optimization technique'
    ],
    correctAnswer: 1,
    explanation: 'The Virtual DOM is a JavaScript representation of the real DOM that React uses to optimize rendering performance.'
  },
  {
    id: 'web-adv-003',
    text: 'What is the purpose of Service Workers?',
    category: 'Web Development',
    difficulty: 'Advanced',
    options: [
      'To style web pages',
      'To enable offline functionality and background sync',
      'To manage server-side routing',
      'To optimize database queries'
    ],
    correctAnswer: 1,
    explanation: 'Service Workers enable offline functionality, background synchronization, and push notifications for web applications.'
  },
  {
    id: 'web-adv-004',
    text: 'What is the difference between REST and GraphQL?',
    category: 'Web Development',
    difficulty: 'Advanced',
    options: [
      'REST is faster than GraphQL',
      'GraphQL uses multiple endpoints, REST uses one',
      'REST uses multiple endpoints, GraphQL uses one',
      'They are the same thing'
    ],
    correctAnswer: 2,
    explanation: 'REST typically uses multiple endpoints for different resources, while GraphQL uses a single endpoint with flexible queries.'
  },
  {
    id: 'web-adv-005',
    text: 'What is the purpose of WebAssembly?',
    category: 'Web Development',
    difficulty: 'Advanced',
    options: [
      'To replace JavaScript entirely',
      'To run high-performance code in web browsers',
      'To improve CSS rendering',
      'To handle database operations'
    ],
    correctAnswer: 1,
    explanation: 'WebAssembly allows high-performance code written in languages like C++, Rust, and Go to run in web browsers at near-native speed.'
  },

  // Backend Development - Beginner
  {
    id: 'backend-beg-001',
    text: 'What is a server?',
    category: 'Backend Development',
    difficulty: 'Beginner',
    options: [
      'A computer that stores files',
      'A computer that provides services to other computers',
      'A type of database',
      'A web browser'
    ],
    correctAnswer: 1,
    explanation: 'A server is a computer or system that provides resources, data, services, or programs to other computers (clients) over a network.'
  },
  {
    id: 'backend-beg-002',
    text: 'What is an API?',
    category: 'Backend Development',
    difficulty: 'Beginner',
    options: [
      'A programming language',
      'A database system',
      'A set of rules for building software',
      'A web hosting service'
    ],
    correctAnswer: 2,
    explanation: 'An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other.'
  },
  {
    id: 'backend-beg-003',
    text: 'What is the primary purpose of a database?',
    category: 'Backend Development',
    difficulty: 'Beginner',
    options: [
      'To create user interfaces',
      'To store and manage data',
      'To style web pages',
      'To optimize network traffic'
    ],
    correctAnswer: 1,
    explanation: 'A database is designed to efficiently store, manage, and retrieve data for applications.'
  },
  {
    id: 'backend-beg-004',
    text: 'What does HTTP stand for?',
    category: 'Backend Development',
    difficulty: 'Beginner',
    options: [
      'HyperText Transfer Protocol',
      'High Tech Transfer Protocol',
      'Home Tool Transfer Protocol',
      'HyperText Transmission Protocol'
    ],
    correctAnswer: 0,
    explanation: 'HTTP stands for HyperText Transfer Protocol and is the foundation of data communication on the World Wide Web.'
  },
  {
    id: 'backend-beg-005',
    text: 'What is a backend framework?',
    category: 'Backend Development',
    difficulty: 'Beginner',
    options: [
      'A tool for designing websites',
      'A library that helps build server-side applications',
      'A database management system',
      'A front-end CSS framework'
    ],
    correctAnswer: 1,
    explanation: 'A backend framework is a library that provides structure and tools for building server-side applications and APIs.'
  },

  // Backend Development - Intermediate
  {
    id: 'backend-int-001',
    text: 'What is the difference between SQL and NoSQL databases?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    options: [
      'SQL is faster than NoSQL',
      'SQL uses structured data, NoSQL uses flexible data models',
      'NoSQL is more secure than SQL',
      'They are the same thing'
    ],
    correctAnswer: 1,
    explanation: 'SQL databases use structured, tabular data with predefined schemas, while NoSQL databases offer flexible data models like documents, key-value pairs, or graphs.'
  },
  {
    id: 'backend-int-002',
    text: 'What is middleware in the context of web development?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    options: [
      'Software that connects different applications',
      'Functions that execute between request and response',
      'Database query optimization',
      'Front-end styling libraries'
    ],
    correctAnswer: 1,
    explanation: 'Middleware are functions that execute during the request-response cycle, typically used for authentication, logging, data parsing, etc.'
  },
  {
    id: 'backend-int-003',
    text: 'What is an ORM (Object-Relational Mapping)?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    options: [
      'A type of database',
      'A tool that maps objects to database tables',
      'A caching mechanism',
      'A security protocol'
    ],
    correctAnswer: 1,
    explanation: 'An ORM is a programming technique that converts data between incompatible type systems using object-oriented programming languages.'
  },
  {
    id: 'backend-int-004',
    text: 'What is JWT authentication?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    options: [
      'A type of database encryption',
      'A token-based authentication method',
      'A password hashing algorithm',
      'A network protocol'
    ],
    correctAnswer: 1,
    explanation: 'JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties for authentication.'
  },
  {
    id: 'backend-int-005',
    text: 'What is database indexing?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    options: [
      'A backup mechanism',
      'A data structure that improves query speed',
      'A security feature',
      'A data compression technique'
    ],
    correctAnswer: 1,
    explanation: 'Database indexing creates data structures that improve the speed of data retrieval operations on database tables.'
  },

  // Backend Development - Advanced
  {
    id: 'backend-adv-001',
    text: 'What is eventual consistency in distributed systems?',
    category: 'Backend Development',
    difficulty: 'Advanced',
    options: [
      'Data is immediately consistent across all nodes',
      'Data becomes consistent over time across distributed nodes',
      'A backup and recovery strategy',
      'A load balancing technique'
    ],
    correctAnswer: 1,
    explanation: 'Eventual consistency means that if no new updates are made to a given data item, all accesses to that item will eventually return the last updated value.'
  },
  {
    id: 'backend-adv-002',
    text: 'What is the CAP theorem?',
    category: 'Backend Development',
    difficulty: 'Advanced',
    options: [
      'A security principle for APIs',
      'A theorem about distributed system trade-offs',
      'A database performance optimization',
      'A network protocol standard'
    ],
    correctAnswer: 1,
    explanation: 'The CAP theorem states that a distributed system can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition Tolerance.'
  },
  {
    id: 'backend-adv-003',
    text: 'What is CQRS (Command Query Responsibility Segregation)?',
    category: 'Backend Development',
    difficulty: 'Advanced',
    options: [
      'A database replication strategy',
      'A pattern separating read and write operations',
      'A security authentication method',
      'A caching mechanism'
    ],
    correctAnswer: 1,
    explanation: 'CQRS is a pattern that separates read (query) and write (command) operations into different models, allowing independent optimization.'
  },
  {
    id: 'backend-adv-004',
    text: 'What is a microservices architecture?',
    category: 'Backend Development',
    difficulty: 'Advanced',
    options: [
      'A single large application',
      'An architectural style breaking applications into small services',
      'A database design pattern',
      'A front-end framework'
    ],
    correctAnswer: 1,
    explanation: 'Microservices architecture breaks down applications into small, independently deployable services that communicate via APIs.'
  },
  {
    id: 'backend-adv-005',
    text: 'What is event sourcing?',
    category: 'Backend Development',
    difficulty: 'Advanced',
    options: [
      'A logging technique',
      'A persistence pattern where state changes are stored as events',
      'A caching strategy',
      'A backup method'
    ],
    correctAnswer: 1,
    explanation: 'Event sourcing is a pattern where all changes to application state are stored as a sequence of events, allowing state reconstruction.'
  },

  // DevOps - Beginner
  {
    id: 'devops-beg-001',
    text: 'What does DevOps stand for?',
    category: 'DevOps',
    difficulty: 'Beginner',
    options: [
      'Development and Operations',
      'Development Optimization',
      'Digital Operations',
      'Deployment Operations'
    ],
    correctAnswer: 0,
    explanation: 'DevOps combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery.'
  },
  {
    id: 'devops-beg-002',
    text: 'What is version control?',
    category: 'DevOps',
    difficulty: 'Beginner',
    options: [
      'A way to manage different software versions',
      'A backup system',
      'A deployment tool',
      'A testing framework'
    ],
    correctAnswer: 0,
    explanation: 'Version control is a system that tracks changes to files over time, allowing collaboration and the ability to revert to previous versions.'
  },
  {
    id: 'devops-beg-003',
    text: 'What is Git?',
    category: 'DevOps',
    difficulty: 'Beginner',
    options: [
      'A programming language',
      'A version control system',
      'A deployment tool',
      'A cloud platform'
    ],
    correctAnswer: 1,
    explanation: 'Git is a distributed version control system that tracks changes in source code during software development.'
  },
  {
    id: 'devops-beg-004',
    text: 'What is continuous integration (CI)?',
    category: 'DevOps',
    difficulty: 'Beginner',
    options: [
      'Manual testing of code',
      'Automatically building and testing code changes',
      'Deploying to production',
      'Writing documentation'
    ],
    correctAnswer: 1,
    explanation: 'Continuous Integration is the practice of automatically building and testing code changes as soon as they are committed to version control.'
  },
  {
    id: 'devops-beg-005',
    text: 'What is a container?',
    category: 'DevOps',
    difficulty: 'Beginner',
    options: [
      'A type of virtual machine',
      'A lightweight, portable package for applications',
      'A database system',
      'A web server'
    ],
    correctAnswer: 1,
    explanation: 'A container is a lightweight, standalone executable package that includes everything needed to run an application.'
  },

  // DevOps - Intermediate
  {
    id: 'devops-int-001',
    text: 'What is the difference between CI and CD?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    options: [
      'CI is for testing, CD is for deployment',
      'CI is for development, CD is for operations',
      'CI is manual, CD is automated',
      'There is no difference'
    ],
    correctAnswer: 0,
    explanation: 'CI (Continuous Integration) focuses on building and testing code, while CD (Continuous Deployment/Delivery) focuses on automatically deploying code changes.'
  },
  {
    id: 'devops-int-002',
    text: 'What is Infrastructure as Code (IaC)?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    options: [
      'Writing infrastructure in programming languages',
      'Managing and provisioning infrastructure through code',
      'Documenting infrastructure',
      'Securing infrastructure with code'
    ],
    correctAnswer: 1,
    explanation: 'Infrastructure as Code is the practice of managing and provisioning infrastructure through machine-readable definition files, rather than physical hardware configuration.'
  },
  {
    id: 'devops-int-003',
    text: 'What is Docker?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    options: [
      'A programming language',
      'A containerization platform',
      'A cloud provider',
      'A version control system'
    ],
    correctAnswer: 1,
    explanation: 'Docker is a platform that uses OS-level virtualization to deliver software in packages called containers.'
  },
  {
    id: 'devops-int-004',
    text: 'What is Kubernetes?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    options: [
      'A container runtime',
      'A container orchestration platform',
      'A virtual machine manager',
      'A cloud provider'
    ],
    correctAnswer: 1,
    explanation: 'Kubernetes is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.'
  },
  {
    id: 'devops-int-005',
    text: 'What is a pipeline in CI/CD?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    options: [
      'A data transfer method',
      'An automated process for building and deploying software',
      'A communication protocol',
      'A version control branch'
    ],
    correctAnswer: 1,
    explanation: 'A CI/CD pipeline is an automated process that takes code from version control through building, testing, and deployment.'
  },

  // DevOps - Advanced
  {
    id: 'devops-adv-001',
    text: 'What is Blue-Green Deployment?',
    category: 'DevOps',
    difficulty: 'Advanced',
    options: [
      'A database replication strategy',
      'A deployment strategy with two identical production environments',
      'A testing methodology',
      'A monitoring technique'
    ],
    correctAnswer: 1,
    explanation: 'Blue-Green Deployment involves running two identical production environments and switching traffic between them to enable zero-downtime deployments.'
  },
  {
    id: 'devops-adv-002',
    text: 'What is Canary Deployment?',
    category: 'DevOps',
    difficulty: 'Advanced',
    options: [
      'Deploying to a small subset of users first',
      'A backup deployment strategy',
      'A testing environment',
      'A monitoring system'
    ],
    correctAnswer: 0,
    explanation: 'Canary Deployment is a technique where new software versions are released to a small subset of users before full deployment.'
  },
  {
    id: 'devops-adv-003',
    text: 'What is Site Reliability Engineering (SRE)?',
    category: 'DevOps',
    difficulty: 'Advanced',
    options: [
      'A testing framework',
      'A discipline for creating reliable and scalable systems',
      'A monitoring tool',
      'A deployment strategy'
    ],
    correctAnswer: 1,
    explanation: 'SRE is a discipline that incorporates aspects of software engineering and applies them to infrastructure and operations problems.'
  },
  {
    id: 'devops-adv-004',
    text: 'What is Chaos Engineering?',
    category: 'DevOps',
    difficulty: 'Advanced',
    options: [
      'A deployment strategy',
      'The practice of testing system resilience by introducing failures',
      'A monitoring technique',
      'A backup methodology'
    ],
    correctAnswer: 1,
    explanation: 'Chaos Engineering is the practice of experimenting on a system to build confidence in its capability to withstand turbulent conditions.'
  },
  {
    id: 'devops-adv-005',
    text: 'What is GitOps?',
    category: 'DevOps',
    difficulty: 'Advanced',
    options: [
      'A Git hosting service',
      'A way of implementing continuous deployment using Git as the source of truth',
      'A version control strategy',
      'A development methodology'
    ],
    correctAnswer: 1,
    explanation: 'GitOps is a way of implementing Continuous Deployment for cloud native applications, using Git as a single source of truth for declarative infrastructure and applications.'
  },

  // Add more categories and questions as needed...
  // This is a representative sample that can be expanded

  // Data Science - Beginner
  {
    id: 'datasci-beg-001',
    text: 'What is data science?',
    category: 'Data Science',
    difficulty: 'Beginner',
    options: [
      'The study of databases',
      'The field that uses scientific methods to extract knowledge from data',
      'A type of programming language',
      'A data storage technique'
    ],
    correctAnswer: 1,
    explanation: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data.'
  },
  {
    id: 'datasci-beg-002',
    text: 'What is machine learning?',
    category: 'Data Science',
    difficulty: 'Beginner',
    options: [
      'Building robots',
      'Teaching computers to learn from data',
      'Creating databases',
      'Writing documentation'
    ],
    correctAnswer: 1,
    explanation: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.'
  },
  {
    id: 'datasci-beg-003',
    text: 'What is a dataset?',
    category: 'Data Science',
    difficulty: 'Beginner',
    options: [
      'A type of database',
      'A collection of data',
      'A programming language',
      'A visualization tool'
    ],
    correctAnswer: 1,
    explanation: 'A dataset is a collection of related, organized data points that can be used for analysis, training, or research purposes.'
  },
  {
    id: 'datasci-beg-004',
    text: 'What is data visualization?',
    category: 'Data Science',
    difficulty: 'Beginner',
    options: [
      'Storing data in databases',
      'Representing data in visual formats like charts and graphs',
      'Cleaning raw data',
      'Analyzing text data'
    ],
    correctAnswer: 1,
    explanation: 'Data visualization is the graphical representation of information and data using visual elements like charts, graphs, and maps.'
  },
  {
    id: 'datasci-beg-005',
    text: 'What is Python in the context of data science?',
    category: 'Data Science',
    difficulty: 'Beginner',
    options: [
      'A database system',
      'A snake species',
      'A programming language popular for data analysis',
      'A visualization tool'
    ],
    correctAnswer: 2,
    explanation: 'Python is a high-level programming language that is widely used in data science due to its simplicity and extensive libraries for data analysis and machine learning.'
  },

  // Module-Specific Questions

  // HTML Fundamentals (html-basics)
  {
    id: 'html-basics-001',
    text: 'What is the purpose of the <head> element in an HTML document?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['html-basics'],
    options: [
      'To display content at the top of the page',
      'To contain metadata about the document',
      'To create heading styles',
      'To define the document header section'
    ],
    correctAnswer: 1,
    explanation: 'The <head> element contains metadata about the document, such as the title, character set, styles, and scripts.'
  },
  {
    id: 'html-basics-002',
    text: 'Which HTML element is used to create an unordered list?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['html-basics'],
    options: [
      '<ol>',
      '<list>',
      '<ul>',
      '<li>'
    ],
    correctAnswer: 2,
    explanation: 'The <ul> (unordered list) element is used to create bulleted lists in HTML.'
  },
  {
    id: 'html-basics-003',
    text: 'What is semantic HTML?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['html-basics'],
    options: [
      'HTML that validates without errors',
      'HTML that describes its meaning to both the browser and developer',
      'HTML that uses only basic tags',
      'HTML that loads quickly'
    ],
    correctAnswer: 1,
    explanation: 'Semantic HTML uses HTML elements according to their intended purpose, describing the meaning of content.'
  },

  // CSS Essentials (css-basics)
  {
    id: 'css-basics-001',
    text: 'What is the CSS box model?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['css-basics'],
    options: [
      'A way to organize CSS files',
      'A model that describes how every HTML element is rendered as a rectangular box',
      'A CSS framework',
      'A layout technique for responsive design'
    ],
    correctAnswer: 1,
    explanation: 'The CSS box model describes how every HTML element is rendered as a rectangular box consisting of content, padding, border, and margin.'
  },
  {
    id: 'css-basics-002',
    text: 'Which CSS selector has the highest specificity?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['css-basics'],
    options: [
      '.class',
      '#id',
      'element',
      'attribute'
    ],
    correctAnswer: 1,
    explanation: 'ID selectors (#id) have the highest specificity among common CSS selectors, followed by class selectors, then element selectors.'
  },
  {
    id: 'css-basics-003',
    text: 'What is the difference between margin and padding in CSS?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['css-basics'],
    options: [
      'Margin creates space inside an element, padding creates space outside',
      'Padding creates space inside an element, margin creates space outside',
      'They are the same thing',
      'Margin affects text, padding affects borders'
    ],
    correctAnswer: 1,
    explanation: 'Padding creates space inside an element\'s border, while margin creates space outside an element\'s border.'
  },

  // JavaScript Fundamentals (javascript-basics)
  {
    id: 'javascript-basics-001',
    text: 'What is a JavaScript function?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['javascript-basics'],
    options: [
      'A type of variable',
      'A reusable block of code that performs a specific task',
      'A loop structure',
      'A CSS selector'
    ],
    correctAnswer: 1,
    explanation: 'A JavaScript function is a reusable block of code that performs a specific task and can be called multiple times.'
  },
  {
    id: 'javascript-basics-002',
    text: 'How do you declare a constant variable in JavaScript?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['javascript-basics'],
    options: [
      'var',
      'let',
      'const',
      'constant'
    ],
    correctAnswer: 2,
    explanation: 'The const keyword is used to declare variables that cannot be reassigned in JavaScript.'
  },
  {
    id: 'javascript-basics-003',
    text: 'What is the DOM in JavaScript?',
    category: 'Web Development',
    difficulty: 'Beginner',
    moduleIds: ['javascript-basics'],
    options: [
      'A JavaScript framework',
      'A database system',
      'The Document Object Model representing HTML elements',
      'A CSS library'
    ],
    correctAnswer: 2,
    explanation: 'The DOM (Document Object Model) is a programming interface that represents HTML documents as a tree structure of objects.'
  },

  // React Fundamentals (react-basics)
  {
    id: 'react-basics-001',
    text: 'What is a React component?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    moduleIds: ['react-basics'],
    options: [
      'A CSS file',
      'A database table',
      'A reusable piece of UI that returns JSX',
      'A JavaScript variable'
    ],
    correctAnswer: 2,
    explanation: 'A React component is a reusable piece of UI that returns JSX (JavaScript XML) and can have its own state and logic.'
  },
  {
    id: 'react-basics-002',
    text: 'What is JSX in React?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    moduleIds: ['react-basics'],
    options: [
      'A styling language',
      'JavaScript XML - a syntax extension for JavaScript',
      'A database query language',
      'A CSS preprocessor'
    ],
    correctAnswer: 1,
    explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files.'
  },
  {
    id: 'react-basics-003',
    text: 'What is the purpose of React hooks?',
    category: 'Web Development',
    difficulty: 'Intermediate',
    moduleIds: ['react-basics'],
    options: [
      'To catch errors in components',
      'To allow functional components to use state and lifecycle features',
      'To style React components',
      'To connect to databases'
    ],
    correctAnswer: 1,
    explanation: 'React hooks allow functional components to use state and other React features that were previously only available in class components.'
  },

  // Node.js Fundamentals (nodejs-basics)
  {
    id: 'nodejs-basics-001',
    text: 'What is Node.js?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    moduleIds: ['nodejs-basics'],
    options: [
      'A front-end framework',
      'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
      'A database system',
      'A CSS library'
    ],
    correctAnswer: 1,
    explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows JavaScript to run on the server side.'
  },
  {
    id: 'nodejs-basics-002',
    text: 'What is npm in Node.js?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    moduleIds: ['nodejs-basics'],
    options: [
      'A server framework',
      'A package manager for Node.js',
      'A database',
      'A testing tool'
    ],
    correctAnswer: 1,
    explanation: 'npm (Node Package Manager) is the default package manager for Node.js that allows you to install and manage third-party packages.'
  },
  {
    id: 'nodejs-basics-003',
    text: 'What is Express.js?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    moduleIds: ['nodejs-basics'],
    options: [
      'A front-end library',
      'A minimal and flexible Node.js web application framework',
      'A database ORM',
      'A CSS framework'
    ],
    correctAnswer: 1,
    explanation: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.'
  },

  // Git Version Control (git-basics)
  {
    id: 'git-basics-001',
    text: 'What does the git commit command do?',
    category: 'DevOps',
    difficulty: 'Beginner',
    moduleIds: ['git-basics'],
    options: [
      'Saves changes to the remote repository',
      'Records changes to the local repository',
      'Creates a new branch',
      'Merges branches'
    ],
    correctAnswer: 1,
    explanation: 'git commit records changes to the local repository with a descriptive message.'
  },
  {
    id: 'git-basics-002',
    text: 'What is the difference between git pull and git fetch?',
    category: 'DevOps',
    difficulty: 'Beginner',
    moduleIds: ['git-basics'],
    options: [
      'git fetch downloads changes, git pull downloads and merges them',
      'git pull downloads changes, git fetch downloads and merges them',
      'They are the same',
      'git fetch is for pushing, git pull is for pulling'
    ],
    correctAnswer: 1,
    explanation: 'git fetch downloads changes from the remote but doesn\'t merge them, while git pull downloads and automatically merges changes into your current branch.'
  },
  {
    id: 'git-basics-003',
    text: 'What is a branch in Git?',
    category: 'DevOps',
    difficulty: 'Beginner',
    moduleIds: ['git-basics'],
    options: [
      'A separate repository',
      'A way to delete commits',
      'An independent line of development',
      'A backup of the main code'
    ],
    correctAnswer: 2,
    explanation: 'A Git branch is an independent line of development that allows you to work on features without affecting the main codebase.'
  },

  // Python Programming (python-basics)
  {
    id: 'python-basics-001',
    text: 'What is a Python list comprehension?',
    category: 'Data Science',
    difficulty: 'Beginner',
    moduleIds: ['python-basics'],
    options: [
      'A way to document Python code',
      'A concise way to create lists based on existing lists',
      'A debugging technique',
      'A type of error handling'
    ],
    correctAnswer: 1,
    explanation: 'Python list comprehensions provide a concise way to create lists based on existing lists or other iterables.'
  },
  {
    id: 'python-basics-002',
    text: 'How do you define a function in Python?',
    category: 'Data Science',
    difficulty: 'Beginner',
    moduleIds: ['python-basics'],
    options: [
      'function myFunc()',
      'def myFunc():',
      'create myFunc()',
      'define myFunc():'
    ],
    correctAnswer: 1,
    explanation: 'In Python, functions are defined using the def keyword followed by the function name and parentheses.'
  },
  {
    id: 'python-basics-003',
    text: 'What is a Python dictionary?',
    category: 'Data Science',
    difficulty: 'Beginner',
    moduleIds: ['python-basics'],
    options: [
      'A book of Python terms',
      'A collection of key-value pairs',
      'A sorted list',
      'A type of loop'
    ],
    correctAnswer: 1,
    explanation: 'A Python dictionary is an unordered collection of key-value pairs that allows efficient lookup of values using keys.'
  },

  // React Native Fundamentals (react-native-basics)
  {
    id: 'react-native-basics-001',
    text: 'What is React Native?',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    moduleIds: ['react-native-basics'],
    options: [
      'A CSS framework for mobile apps',
      'A JavaScript framework for building native mobile apps',
      'A mobile game engine',
      'A mobile operating system'
    ],
    correctAnswer: 1,
    explanation: 'React Native is a JavaScript framework for building native mobile apps for iOS and Android using React.'
  },
  {
    id: 'react-native-basics-002',
    text: 'What is the difference between React Native and React?',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    moduleIds: ['react-native-basics'],
    options: [
      'They are exactly the same',
      'React Native uses native components, React uses web components',
      'React Native is for web, React is for mobile',
      'React Native is older than React'
    ],
    correctAnswer: 1,
    explanation: 'React Native uses native mobile components while React uses web components like div, span, etc.'
  },
  {
    id: 'react-native-basics-003',
    text: 'What is the purpose of the StyleSheet API in React Native?',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    moduleIds: ['react-native-basics'],
    options: [
      'To style web pages',
      'To create CSS files for mobile apps',
      'To create styles that are optimized for mobile performance',
      'To validate CSS syntax'
    ],
    correctAnswer: 2,
    explanation: 'The StyleSheet API in React Native creates optimized style objects that are sent to native components for better performance.'
  },

  // Database Fundamentals (database-basics)
  {
    id: 'database-basics-001',
    text: 'What is a primary key in a database?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    moduleIds: ['database-basics'],
    options: [
      'A password for the database',
      'A unique identifier for each record in a table',
      'A backup key',
      'The first column in a table'
    ],
    correctAnswer: 1,
    explanation: 'A primary key is a unique identifier for each record in a database table that ensures each row can be uniquely identified.'
  },
  {
    id: 'database-basics-002',
    text: 'What is SQL?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    moduleIds: ['database-basics'],
    options: [
      'A programming language for web development',
      'A query language for managing relational databases',
      'A markup language',
      'A styling language'
    ],
    correctAnswer: 1,
    explanation: 'SQL (Structured Query Language) is a domain-specific language for managing and querying relational databases.'
  },
  {
    id: 'database-basics-003',
    text: 'What is the difference between SQL and NoSQL databases?',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    moduleIds: ['database-basics'],
    options: [
      'SQL databases are faster than NoSQL',
      'SQL uses structured data with schemas, NoSQL uses flexible data models',
      'NoSQL databases are more secure',
      'They are exactly the same'
    ],
    correctAnswer: 1,
    explanation: 'SQL databases use structured, tabular data with predefined schemas, while NoSQL databases offer flexible data models like documents, key-value pairs, or graphs.'
  },

  // Docker Fundamentals (docker-basics)
  {
    id: 'docker-basics-001',
    text: 'What is a Docker image?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    moduleIds: ['docker-basics'],
    options: [
      'A running instance of a container',
      'A lightweight, standalone, executable package that includes everything needed to run software',
      'A virtual machine',
      'A backup file'
    ],
    correctAnswer: 1,
    explanation: 'A Docker image is a lightweight, standalone, executable package that includes everything needed to run software including code, runtime, libraries, and settings.'
  },
  {
    id: 'docker-basics-002',
    text: 'What is the difference between Docker image and Docker container?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    moduleIds: ['docker-basics'],
    options: [
      'They are the same thing',
      'Image is a template, container is a running instance of an image',
      'Container is a template, image is a running instance',
      'Image is larger than container'
    ],
    correctAnswer: 1,
    explanation: 'A Docker image is a template that defines how to create a container, while a Docker container is a running instance of an image.'
  },
  {
    id: 'docker-basics-003',
    text: 'What is Dockerfile?',
    category: 'DevOps',
    difficulty: 'Intermediate',
    moduleIds: ['docker-basics'],
    options: [
      'A configuration file for Docker settings',
      'A text document that contains commands to assemble a Docker image',
      'A log file for Docker containers',
      'A backup of Docker images'
    ],
    correctAnswer: 1,
    explanation: 'A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image.'
  },

  // Effective Communication (communication-skills)
  {
    id: 'communication-skills-001',
    text: 'What is active listening in communication?',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    moduleIds: ['communication-skills'],
    options: [
      'Speaking loudly so everyone can hear',
      'Fully concentrating, understanding, and responding to what is being said',
      'Writing notes during conversations',
      'Agreeing with everything the speaker says'
    ],
    correctAnswer: 1,
    explanation: 'Active listening is the practice of fully concentrating, understanding, responding to, and remembering what is being said.'
  },
  {
    id: 'communication-skills-002',
    text: 'What is the importance of non-verbal communication?',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    moduleIds: ['communication-skills'],
    options: [
      'It is not important in professional settings',
      'It often conveys more meaning than words and includes body language, tone, and gestures',
      'It only matters in personal relationships',
      'It is the same as verbal communication'
    ],
    correctAnswer: 1,
    explanation: 'Non-verbal communication often conveys more meaning than words and includes body language, tone of voice, facial expressions, and gestures.'
  },
  {
    id: 'communication-skills-003',
    text: 'What is feedback in the context of professional communication?',
    category: 'Soft Skills',
    difficulty: 'Beginner',
    moduleIds: ['communication-skills'],
    options: [
      'Complaints about work performance',
      'Information given about past behavior or performance to guide future improvement',
      'Company announcements',
      'Gossip between colleagues'
    ],
    correctAnswer: 1,
    explanation: 'Professional feedback is constructive information provided about past performance to guide future improvement and development.'
  },

  // Agile Project Management (project-management)
  {
    id: 'project-management-001',
    text: 'What is Scrum in Agile methodology?',
    category: 'Soft Skills',
    difficulty: 'Intermediate',
    moduleIds: ['project-management'],
    options: [
      'A rugby term used in sports',
      'An Agile framework for managing complex projects through iterative development',
      'A type of project management software',
      'A method for writing code'
    ],
    correctAnswer: 1,
    explanation: 'Scrum is an Agile framework that enables teams to work together on complex products through iterative development and regular feedback.'
  },
  {
    id: 'project-management-002',
    text: 'What is a sprint in Agile development?',
    category: 'Soft Skills',
    difficulty: 'Intermediate',
    moduleIds: ['project-management'],
    options: [
      'A short distance race',
      'A time-boxed period of work (usually 1-4 weeks) where a team completes a set amount of work',
      'A type of meeting',
      'A debugging technique'
    ],
    correctAnswer: 1,
    explanation: 'A sprint is a time-boxed period (typically 1-4 weeks) during which a team works on completing a set amount of work and delivers a potentially shippable product increment.'
  },
  {
    id: 'project-management-003',
    text: 'What is the role of a Scrum Master?',
    category: 'Soft Skills',
    difficulty: 'Intermediate',
    moduleIds: ['project-management'],
    options: [
      'The team\'s primary coder',
      'A servant-leader who facilitates Scrum processes and helps the team become self-organizing',
      'The project manager who assigns tasks',
      'The team\'s tester'
    ],
    correctAnswer: 1,
    explanation: 'A Scrum Master is a servant-leader who facilitates Scrum processes, removes impediments, and helps the team become self-organizing and cross-functional.'
  }
]

// Helper function to get questions by category, difficulty, and optionally module
export function getQuestionsByCategory(category: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', moduleId?: string): Question[] {
  return questionBank.filter(question => {
    // Filter by category and difficulty
    const categoryMatch = question.category === category
    const difficultyMatch = question.difficulty === difficulty

    // If moduleId is provided, check if question is specifically for this module or is general (no moduleIds specified)
    let moduleMatch = true
    if (moduleId) {
      // If question has specific moduleIds, it must include this module
      if (question.moduleIds && question.moduleIds.length > 0) {
        moduleMatch = question.moduleIds.includes(moduleId)
      }
      // If question has no moduleIds, it's a general question that can be used by any module
      // so moduleMatch remains true
    }

    return categoryMatch && difficultyMatch && moduleMatch
  })
}

// Helper function to get random questions
export function getRandomQuestions(category: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', count: number, moduleId?: string): Question[] {
  const questions = getQuestionsByCategory(category, difficulty, moduleId)
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, questions.length))
}

// Helper function to validate answer
export function validateAnswer(question: Question, userAnswer: number): boolean {
  return userAnswer === question.correctAnswer
}

// Helper function to calculate score
export function calculateScore(questions: Question[], userAnswers: number[]): number {
  let correct = 0
  questions.forEach((question, index) => {
    if (index < userAnswers.length && validateAnswer(question, userAnswers[index])) {
      correct++
    }
  })
  return Math.round((correct / questions.length) * 100)
}

// Debug function to test filtering
export function debugQuestionFiltering(category: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', moduleId: string): void {
  console.log('=== Debug Question Filtering ===')
  console.log('Category:', category)
  console.log('Difficulty:', difficulty)
  console.log('Module ID:', moduleId)

  const allQuestions = getQuestionsByCategory(category, difficulty, moduleId)
  console.log('Total questions found:', allQuestions.length)

  allQuestions.forEach((question, index) => {
    console.log(`${index + 1}. ${question.text}`)
    console.log(`   ID: ${question.id}`)
    console.log(`   Module IDs: ${question.moduleIds ? question.moduleIds.join(', ') : 'General (no specific module)'}`)
    console.log('')
  })
  console.log('=== End Debug ===')
}