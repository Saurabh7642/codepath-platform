const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

const sampleProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    constraints: "• 2 ≤ nums.length ≤ 10⁴\n• -10⁹ ≤ nums[i] ≤ 10⁹\n• -10⁹ ≤ target ≤ 10⁹\n• Only one valid answer exists.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ]
  },
  {
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    difficulty: "Medium",
    tags: ["Linked List", "Math"],
    constraints: "• The number of nodes in each linked list is in the range [1, 100]\n• 0 ≤ Node.val ≤ 9\n• It is guaranteed that the list represents a number that does not have leading zeros.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    constraints: "• 0 ≤ s.length ≤ 5 * 10⁴\n• s consists of English letters, digits, symbols and spaces.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ]
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    constraints: "• nums1.length == m\n• nums2.length == n\n• 0 ≤ m ≤ 1000\n• 0 ≤ n ≤ 1000\n• 1 ≤ m + n ≤ 2000\n• -10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ]
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    constraints: "• 1 ≤ s.length ≤ 10⁴\n• s consists of parentheses only '()[]{}'.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string is valid."
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets are properly matched."
      }
    ]
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    constraints: "• 1 ≤ nums.length ≤ 10⁵\n• -10⁴ ≤ nums[i] ≤ 10⁴",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      }
    ]
  },
  {
    title: "Binary Tree Inorder Traversal",
    slug: "binary-tree-inorder-traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "Easy",
    tags: ["Stack", "Tree", "Hash Table"],
    constraints: "• The number of nodes in the tree is in the range [0, 100]\n• -100 ≤ Node.val ≤ 100",
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal visits left, root, then right."
      }
    ]
  },
  {
    title: "Merge k Sorted Lists",
    slug: "merge-k-sorted-lists",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    constraints: "• k == lists.length\n• 0 ≤ k ≤ 10⁴\n• 0 ≤ lists[i].length ≤ 500\n• -10⁴ ≤ lists[i][j] ≤ 10⁴",
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are merged in ascending order."
      }
    ]
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy",
    tags: ["Math", "Dynamic Programming"],
    constraints: "• 1 ≤ n ≤ 45",
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top: 1+1 steps or 2 steps."
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways: 1+1+1, 1+2, or 2+1."
      }
    ]
  },
  {
    title: "Word Ladder",
    slug: "word-ladder",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Return the length of the shortest transformation sequence.",
    difficulty: "Hard",
    tags: ["Hash Table", "String", "BFS"],
    constraints: "• 1 ≤ beginWord.length ≤ 10\n• endWord.length == beginWord.length\n• 1 ≤ wordList.length ≤ 5000\n• wordList[i].length == beginWord.length",
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: "5",
        explanation: 'One shortest transformation: "hit" -> "hot" -> "dot" -> "dog" -> "cog"'
      }
    ]
  }
];

async function seedProblems() {
  try {
   
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');


    await Problem.deleteMany({});
    console.log('Cleared existing problems');


    await Problem.insertMany(sampleProblems);
    console.log('Sample problems inserted successfully');


    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding problems:', error);
    process.exit(1);
  }
}

seedProblems();