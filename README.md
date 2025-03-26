<a id="readme-top"></a>
<!-- 
README styling provided by https://github.com/othneildrew/Best-README-Template
 https://readme.so/
 https://www.markdownguide.org/basic-syntax/
 -->



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-nomdb-🍰">About The Project</a></li>
    <li><a href="#demo">Demo</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#local-setup">Local Setup</a></li>
    <li><a href="#spoonacular-reference">API Reference</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#limitations">Limitations</a></li>
    <li><a href="#creators">Creators</a></li>
  </ol>
</details>

# About nomDB 🍰

nomDB is a resource for finding and saving recipes. Ever make a recipe and wanted to add notes, or realize the proportions aren't quite right? You can edit the recipes as needed to add your own personal touch!

This project uses Firebase to handle user login, registration, and authentication. SpoonacularAPI is used to retrieve recipes and when a user would like to save a recipe to their collection, a copy is saved. Recipes are saved to the user's profile utilizing Firebase. From there, a user is able to modify a recipe by adding, editing, and deleting ingredients and instructions and even adding their own notes if they wish. 


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Demo
![sitedemo](public/assets/images/sitedemo.gif)

[Check it out here!](https://nom-db.netlify.app/)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Built With
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
* ![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Local Setup

Clone the project (or download zip of the project)

```bash
  git clone https://github.com/nthaberl/recipe-site.git
```

Go to the project directory

```bash
  cd recipe-site
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Spoonacular Reference
[read official documentation here](https://spoonacular.com/food-api/docs#Search-Recipes-Complex)

#### Get all items

```http
  GET https://api.spoonacular.com/recipes/complexSearch
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|  `query`  | `string` | Natural language recipe search query |


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

Users can search to find recipes. When they find a recipe they like, they can save it to their collection. Once saved to their collection, they are able to modify the recipe by editing the ingredients, instructions, and notes. Recipes can also be removed from their collections.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Limitations and Bugs

* Currently is not compatible with dark mode. 
* Users can not edit or upload pictures for the recipes.
* Some images in the API are broken so broken images may appear in search. 
* User is able to add a blank field for ingredients and instructions


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Creators 👋

- [@nthaberl](https://www.github.com/nthaberl)
- [@GiecelT](https://www.github/com/GiecelT)

