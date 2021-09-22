import { useEffect, useState, useRef, useCallback } from 'react'
import './message.css';
import axios from 'axios'
import moment from 'moment';
const Message = () => {
    const [apiData, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)
    const [newMessage, setMessage] = useState({
        'Content': '',
        'CreatedAt': '2021-07-11T08:28:04',
        'UpdatedAt': '2021-07-11T08:28:04',
        'Message Type': "0"
    })
    useEffect(() => {
        const callApi = async () => {
            const res = await axios.get(`https://retoolapi.dev/m89lfD/limechat?_page=${pageNumber}&_limit=15`);
            console.log(res.data)
            res.data && setData((prevState) => {
                return [
                    ...prevState,
                    ...res.data
                ]
            })
            setHasMore(res.data.length > 0)
            setLoading(false)
        }
        callApi();
    }, [pageNumber])

    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])
    console.log(pageNumber)
    const sendMessage = async (e) => {
        const res = await axios.post('https://retoolapi.dev/m89lfD/limechat', newMessage)
        console.log(res.data)
    }
    const handleChange = (e) => {
        setMessage((prevState) => {
            return {
                ...prevState,
                'Content': e.target.value,
                'CreatedAt': moment().format(),
                'UpdatedAt': moment().format(),
            }
        })
    }
    return (
        <>
            <div className="messageMain">
                {
                    loading ?
                        (
                            <h2>Loading...</h2>
                        ) : (
                            apiData.map((e, idx) => {
                                if (apiData.length === idx + 1) {
                                    return <div ref={lastBookElementRef} key={`${idx}${e.Content}`}> </div>
                                } else {
                                    return <div className={e['Message Type'] === "0" ? "message own" : "message"} key={`${e.Content}${idx}`}>
                                        <div className="messageTop">
                                            <p className="messageText">
                                                {e.Content}
                                            </p>
                                        </div>
                                        <div className="messageBottom">
                                            {moment(e.CreatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                                        </div>
                                    </div>
                                }
                            })
                        )
                }
            </div>
            <div className="typeMessageDiv">
                <input type="text" className="typeMessage" placeholder="Type Message..." onChange={handleChange} />
                <button onClick={sendMessage} className="btn1">Send</button>
            </div>
        </>
    )
}

export default Message