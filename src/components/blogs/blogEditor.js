import React, { useState, useEffect, useRef } from "react"
import ReactDOMServer from 'react-dom/server'
import "../../assets/css/blog_editor.css"
import { ToolsIcon,TextIcon,ImageUploadIcon,SpacebarIcon,VideoIcon } from "../../assets/images";




const BlogEditor = () => {

    const titleInput = useRef(null)
    const blogMainPaper = useRef(null)

    const editableP = useRef(null)
    const toolsHolster = useRef(null)

    const [ count, setCount ] = useState(0)
    const [ rows, setRows ] = useState(1)
    const [ nullArray, setNullArray ] = useState([ {
        contentId : 0
    } ])

    const [ contentInput, setContentInput ] = useState([])

    let x = []

    useEffect(() => {

        let dummyArray = nullArray.map((item, i) => {

            let DOMArray = []

            if(item.contentValue === "spacer-x94525"){

                // editableP.current.style.display = "none"

                DOMArray.push(
                    <div 
                        className={"spacer-wrap " + "non-text-element" + i}
                        key = {i}
                        >
                        <div className = "individual-spacer"></div>
                        <div className = "individual-spacer"></div>
                        <div className = "individual-spacer"></div>
                    </div>
                )
            }


            return (
                <div 
                    className = {"simple-text " + "outer-content-select-" + i}
                    key = { item.contentId }
                    >
                    { DOMArray }
                    <div
                        className = "tools-and-input"
                        >
    
                        <div
                            className={"tools-holster-wrap tool-box" + i}
                            ref = {toolsHolster}
                            >
                            <div 
                                className="dummy-wrap-tools-button"
                                >
                                <div 
                                    className="tools-wrap"
                                    >
                                    <div className="tools-flex">
                                        <ToolsIcon/>
                                        <div className="tool-tab-box-container">
                                            <div className="tool-tab-inner-container">
                                                <div className="dummy-container"></div>
                                                <div className="tools-outer-container">
                                                    <div 
                                                        className="edit-tool-container"
                                                        onClick = {() => {

                                                        }}
                                                        >
                                                        <ImageUploadIcon/>
                                                    </div>

                                                    <div 
                                                        className="edit-tool-container"
                                                        onClick = {() => {
                                                            console.log('video')
                                                        }}
                                                        >
                                                        <VideoIcon/>
                                                    </div>

                                                    <div 
                                                        className="edit-tool-container"
                                                        onClick = {() => {
                                                            createNewContent(i, "spacer-x94525")
                                                        }}
                                                        >
                                                        <SpacebarIcon/>
                                                    </div>

                                                    <div 
                                                        className="edit-tool-container"
                                                        onClick = {() => {
                                                            console.log('sub header')
                                                        }}
                                                        >
                                                        <TextIcon/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref = {editableP}
                            className = "new-p"
                            contentEditable = {true}
                            suppressContentEditableWarning = {true}
                            typeof = "text"
                            onPaste = {e => {
                                e.preventDefault()
                                let text = e.clipboardData.getData("text/plain")
                                document.execCommand("insertHTML", false, text)
    
                                if(e.target.innerText.length >= 0){
                                    dummyArray.map((toolBox, j) => {
                                        document.getElementsByClassName("tool-box" + j)[0].style.display = "none"
                                    })
                                }
                            }}
                            onKeyPress = {
                                e => {
                                    if(e.target.innerText.length >= 0){
                                        dummyArray.map((toolBox, j) => {
                                            document.getElementsByClassName("tool-box" + j)[0].style.display = "none"
                                        })
                                    }
                                }
                            }
                            onFocus = {
                                (e) => {
                                    
                                    if(i>0){
                                        if(e.target.innerText.length === 0){
                                            dummyArray.map((toolBox, j) => {
                                                if(i === j){
                                                    document.getElementsByClassName("tool-box" + j)[0].style.display = "block"
                                                }
                                                else{
                                                    document.getElementsByClassName("tool-box" + j)[0].style.display = "none"
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                            onKeyDown = {e => {
                                if(e.key === "Enter"){
                                    if( window.getSelection().focusOffset === e.target.innerText.length ){
                                        e.preventDefault()
                                        createNewContent(i)
                                    }
    
                                    else{
                                        e.preventDefault()
    
                                        let postCursorText = e.target.innerText.split("").filter((char, i) => i >= window.getSelection().focusOffset).join('')
                                        let preCursorText = e.target.innerText.split("").filter((char, i) => i < window.getSelection().focusOffset).join('')
                                        
                                        e.target.innerText = ""
                                        document.execCommand('insertHTML', false, preCursorText)
    
                                        createNewContent(i, postCursorText)
    
                                        // // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
                                        // document.execCommand('insertHTML', false, '</br>')
                                        // // prevent the default behaviour of return key pressed
                                        // return false
                                    }
                                }
    
                                if(e.keyCode === 8){
                                    if(e.target.innerText === ""){
                                        deleteThisTextArea(i)
                                    }
    
                                    if(e.target.innerText.length === 1){
                                        document.getElementsByClassName("tool-box" + i)[0].style.display = "block"
                                    }
                                }
                            }}
                            >
                            {
                                item.contentValue === "spacer-x94525"
                                ?
                                null
                                :
                                item.contentValue
                            }
                        </div>
                    </div>
                
                </div>
            )
            
        })

        setContentInput(
            [
                ...dummyArray
            ]
        )

    }, [ nullArray ])

    useEffect(() => {
        if(editableP.current){
            editableP.current.focus()
        }
    }, [ contentInput ])

    const increaseRows = (e, itemNo) => {
        let val =  e.target

        val.style.height = "1px";
        val.style.height = (20 + val.scrollHeight)+"px";
    }


    const deleteThisTextArea = (id) => {

        let dummyArray = nullArray
        let contentArray = contentInput

        setCount(count + 1)

        if(id !== 0){
            dummyArray.splice(
                id,
                1
            )
        }

        setNullArray(
            [
                ...dummyArray
            ]
        )

        // Focus the previous element
    }
    

    const createNewContent = (id, contentValue) => {
       
        let dummyArray = nullArray

        setCount(count + 1)

        dummyArray.splice(
            id + 1,
            0,
            {
                contentId : count + 1,
                contentValue 
            }
        )
        
        setNullArray(
            [
                ...dummyArray
            ]
        )
       
    }


    const mapNewContentHere = () => {
        return contentInput
    }


    return (
        <div className="blog-wrapper">
            <div className="blog-gray-bgd">
                <div 
                    className="blog-main-paper"
                    ref = {blogMainPaper}
                    >

                    <textarea 
                        name="title-input" 
                        id="blog-title-input"
                        className = "title-input" 
                        ref = {titleInput}
                        maxLength = "135"
                        rows={rows}
                        placeholder = "Title here..."
                        onChange = {e => {
                            increaseRows(e)
                        }}
                        onKeyPress = {e => {
                            if(e.key === "Enter"){
                                editableP.current.focus()
                            }
                        }}
                        >
                    </textarea>

                    {
                        mapNewContentHere()
                    }

                    

                    

                    <div className="spaces-for-chillin"></div>
                </div>
            </div>

        </div>
    )
}

export default BlogEditor