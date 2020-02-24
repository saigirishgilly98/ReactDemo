import React, { useState } from "react";
import "./styles.css";

const query = `
{
allPosts {
  id
  user {
    name
    email
  }
  post_text
}
}
`;

const mutation = `
mutation CreatePost($post_text: String!) {
createPost(
  userId: 1
  post_text: $post_text
) {
  id
  post_text
  user {
    id
    name
    email
  }
}
}`;

const NewPost = ({ createPost }) => {
  const [value, setValue] = useState("");

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    createPost(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <span
        style={{
          backgroundColor: "#ffffff",
          padding: "20px 10px 5px",
          margin: "15px",
          width: "400px"
        }}
      >
        <label>
          <textarea value={value} onChange={handleChange} rows="5" cols="70" />
        </label>
      </span>
      <br />
      <input
        style={{
          backgroundColor: "#008080",
          border: "none",
          color: "white",
          padding: "12px 25px",
          fontSize: "15px"
        }}
        type="submit"
        value="Post"
      />
    </form>
  );
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Post = ({ text, name }) => {
  return (
    <div
      style={{
        border: "1px solid #808080",
        backgroundColor: "#ffffff",
        borderBottom: `10px solid ${getRandomColor()}`,
        padding: "20px 10px 5px",
        margin: "15px",
        width: "400px"
      }}
    >
      <div>
        <div>{text}</div>
        <div style={{ textAlign: "end" }}>
          <i>By {name}</i>
        </div>
      </div>
    </div>
  );
};

const PostList = ({ posts }) => {
  // WIKI: A conditional logic to check is data is available
  if (!posts) {
    return "Loading..";
  }

  // WIKI: Using Array.map function lets loop through all the post and create a neat Card for them
  const Posts = posts.map(({ id, post_text, user: { name } }) => (
    <Post key={id} text={post_text} name={name} />
  ));
  return (
    <div
      style={{
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {Posts}
    </div>
  );
};

class App extends React.Component {
  state = {
    loading: true,
    data: null,
    error: false
  };

  //WIKI: Making a Query Call to GraphQL Backend to fetch all the posts
  fetchPosts() {
    fetch("https://workshop.anands.io/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    })
      .then(response => {
        return response.json();
      })
      .then(responseAsJson => {
        this.setState({ loading: false, data: responseAsJson.data.allPosts });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  //WIKI: Making a Mutation Call to GraphQL Backend to update a new post
  createPost(postData) {
    fetch("https://workshop.anands.io/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables: {
          post_text: postData
        },
        query: mutation
      })
    })
      .then(response => {
        this.fetchPosts();
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  componentDidMount() {
    this.fetchPosts();
  }

  render() {
    const { loading, data, error } = this.state;

    if (error) {
      return <h2> Something went wrong, please try later! </h2>;
    }
    return (
      <div className="App">
        <h2>
          My blog app!{" "}
          <span role="img" aria-label="Emoji icon of a rocket">
            🚀
          </span>
        </h2>
        <NewPost createPost={this.createPost.bind(this)} />
        {loading ? "Loading..." : <PostList posts={data} />}
      </div>
    );
  }
}

export default App;
