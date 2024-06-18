import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
//import ClassCounter from './components/ClassCounter';
//import PostItem from './components/PostItem';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import MySelect from './components/UI/select/MySelect';
import MyInput from './components/UI/input/MyInput';
import axios from 'axios';
import PostService from './API/PostService';
import Header from './components/Header';
import Footer from './components/Footer';
import { Router } from 'react-router-dom';
import { width } from 'dom-helpers';
import Description from './components/Description';
import MyModal from './MyModal/MyModal';
import MyButton from './components/UI/button/Mybutton';
import { getPageCount } from './utils/pages';
import { useFetching } from './hooks/useFetching';
import { getPagesArray } from './utils/pages';

function App() {


  const [posts, setPosts] = useState([
    { id: 1, title: 'Aa', body: 'Aaaaaa' },
    { id: 2, title: 'Bb', body: 'Bbbbbbb' },
    { id: 3, title: 'Cc', body: 'Ccccccccc' },


  ])
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  let pagesArray = getPagesArray(totalPages);

  const [fetchPosts, isPostsLoading, postError] = useFetching( async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data)
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit));
  })

  useEffect(() => {
    fetchPosts()
  }, [page])




  const [selectedSort, setSelectedSort] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  //const sortedPosts = [...posts].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]))




  const sortedPosts = useMemo(() => {
    if (selectedSort) {
      return [...posts].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]))
    }
    return posts;

  }, [selectedSort, posts])

  const sortedAndSearchedPosts = useMemo(() => {
    return sortedPosts.filter(post => post.title.toLowerCase().includes(searchQuery))

  }, [searchQuery, sortedPosts])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const sortPosts = (sort) => {
    setSelectedSort(sort);

  }


  const changePage = (page) => {
    setPage(page)
    
    }





  return (

    <div className="App">
      <Header />
      <div id="home" className='all_content'>
        {/* <button style={{ marginLeft: '0px' }} onClick={fetchPosts} >GET POSTS</button> */}


        <MyButton style={{ marginTop: 30 }} onClick={() => setModal(true)}>
          Создать пользователя
        </MyButton>
        <MyModal visible={modal} setVisible={setModal}>
          <PostForm create={createPost} />
        </MyModal>
        <hr style={{ margin: '15px 0' }} />


        <div>
          <MyInput
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
          />
          <MySelect
            defaultValue={selectedSort}
            onChange={sort => setSelectedSort(sort)}
            options={[
              { value: 'title', name: ' По названию' },
              { value: 'body', name: ' По описанию' }
            ]}
          />

          {/* {pagesArray.map(p =>
            <MyButton>{p}</MyButton>

          )} */}
        </div>



        {sortedAndSearchedPosts.length !== 0
          ? <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Список постов 1" />
          : <h1 style={{ textAlign: 'center' }}>Посты не найдены</h1>
        }
         
         
         

         <div className="page__wrapper">
           {pagesArray.map (p =>
           <span
             onClick ={() => setPage(p)}
             key = {p}
           className={page === p ? 'page page__current' : 'page'}
           >
            {p}
            </span>
           )}

         </div>
        
         
         {/* return (
          <div className="post">
            <div className="post__content">
              <strong>{props.post.id}. {props.post.title}</strong>
            </div>
             {props.post.body}

          </div>
         ) */}


      </div>
      <div id="home">
        <Description />
      </div>

      <div id="contact">
        <Footer />
      </div>
    </div>

  )


}

export default App;
