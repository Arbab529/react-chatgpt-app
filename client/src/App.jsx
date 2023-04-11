import send from './assets/send.svg'
import user from './assets/user.png'
import bot from './assets/bot.png'
import loadingIcon from './assets/loader.svg'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

function App() {
  const [input, setInputData] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector('.layout').scrollTop =
      document.querySelector('.layout').scrollHeight
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post('https://arbab-chatgpt-bff.herokuapp.com', { input }, {
      headers: {
        "Content-Type": 'application/json'
      }
    })
    return data
  }

  const onSubmit = () => {
    if (input.trim() === "") return;
    onUpdatePosts(input)
    onUpdatePosts("Loading...", false, true)
    fetchBotResponse().then((res) => {
      onUpdatePosts(res.bot.trim(), true)
    })
    setInputData('')
  }

  const BotTyping = (post) => {

    let index = 0;
    let interval = setInterval(() => {
      if (index < post.length) {
        setPosts(prevState => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: 'bot',
              post: post.charAt(index - 1)
            })
          } else {
            prevState.push({
              type: 'bot',
              post: lastItem.post + post.charAt(index - 1)
            })
          }
          return [...prevState]
        })
        index++
      } else {
        clearInterval(interval);
      }
    }, 30);

  }
  const onUpdatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      BotTyping(post);
    } else {
      setPosts(prevState => {
        return [
          ...prevState,
          { type: isLoading ? "loading" : "user", post }
        ]
      })
    }
  }
  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit()
    }
  }

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {/* Chat Bubble */}
          {
            posts.map((post, index) => {
              return (
                <div key={index} className={`chat-bubble 
                ${post.type === "bot" || post.type === "loading" ? "bot" : ''}`
                }>
                  <div className="avatar">
                    <img src={post.type === "bot" || post.type === "loading" ? bot : user} alt="" />
                  </div>
                  {
                    post.type === "loading" ?
                      (<div className="loader">
                        <img src={loadingIcon} alt="LoadingIcon" />
                      </div>)
                      :
                      (<div className="post">{post.post}</div>)
                  }
                </div>
              )
            })
          }
        </div>
      </section>

      {/* Input Area */}
      <footer>
        <input type="text" autoFocus
          className="composebar"
          placeholder='Question here!'
          value={input}
          onChange={(e) => setInputData(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="Send Icon" />
        </div>
      </footer>
      <p className='alert'>&copy; Arbab Anjum - Senior Software Engineer</p>
    </main>
  )
}

export default App
