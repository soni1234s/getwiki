import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Typewriter from "typewriter-effect";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GetWiki = () => {

    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [searchInfo, setSearchInfo] = useState({});
    const [page, setPage] = useState(1);
  
    const handleChange = (event, value) => {
      
      setPage(value);
    };
  
    const getResults = async (e) => {
      e.preventDefault();
      if(search==="")return;
  
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;
      const resp = await axios.get(endpoint);
      
          
      if(!resp.data.query.searchinfo.totalhits){
        toast.error("NO DATA FOUND")
        setSearch("");
      }
  
      setData(resp.data.query.search)
      setSearchInfo(resp.data.query.searchinfo)
  
      // console.log(searchInfo)
      // console.log(data)
      
    }
  
    const handleInputs = (e) => {
         e.preventDefault();
         setSearch(e.target.value);
    }
  
    return (
      <div>
        <div className="jumbotron" >
          <div class="row mt-5">
            <div class="col-md-5 mx-auto">
              <h2 >
              <Typewriter 
                options={{
                  autoStart: true,
                  loop: true,
                  delay: 40,
                  strings: [
                    "GET Wiki 🧾",
                    "GET Wikipedia 📑"
                  ],
                }}
              />
             </h2>
              <div class="input-group">
                <input
                  class="form-control border border-light"
                  type="search"
                  value={search}
                  onChange = {handleInputs}
                  id="example-search-input"
                />
                <button type="button" class="btn btn-secondary" onClick={getResults}>Search</button>
                <ToastContainer />
              </div>
            </div>
          </div>
          { (searchInfo.totalhits) ? <p style={{color: "white", fontWeight: "bold" , textAlign: "center", padding: "10px"}}>Total Results: {searchInfo.totalhits}</p> : ""}
        </div>
  
      
       {(Math.floor(searchInfo.totalhits/20) && search!=="") ? 
        <div className="results">   
  
        {data.map((result, i) => {
  
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`
          if(page === 1 && i<10){
           //console.log(i);
           return (
            <div className='result' key={i}>
              <h3>{result.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: result.snippet}}></p>
              <a href = {url} target="_blank" rel="noreferrer" class="btn btn-info size">Read More</a>
            </div>
           )
          }
          else if(page === 2 && i>10){
            return (
            <div className='result' key={i}>
              <h3>{result.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: result.snippet}}></p>
              <a href = {url} target="_blank" rel="noreferrer" class="btn btn-info size">Read More</a>
            </div>
           )
          }
  
           return <></>
        })}  
        
        
        <div  style={{display: "flex", justifyContent: "center"}}><Stack spacing={2}>
        <Pagination count={2} page={page} onChange={handleChange} />
      </Stack> </div>
  
        </div> : <></>}
  
        </div>
  
  )
}