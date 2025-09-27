import React from "react";
import "../css/header.scss"
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowRightToBracket,
    faMagnifyingGlass,
    faPlus,
    faRightFromBracket,
    // faUser
} from "@fortawesome/free-solid-svg-icons";
import {UserContext} from "../contexts/UserContext.tsx";
import {BaseComponent} from "../types/BaseComponent.tsx";
import type {BaseState} from "../types/PageTypes.ts";

type State = BaseState & {
    searchTerm: string
}

export class Header extends BaseComponent<object,State>{

    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>;

    state:State = {
        loading: false,
        err: null,
        searchTerm:""
    }

    handleLogout = async () => {
        this.context.logout();
        window.location.href="/";
    }
    
    inputChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        this.setState({searchTerm:e.target.value})
    }

    render(){
        const {searchTerm} = this.state;
        const {isLoggedIn} = this.context;
        return(
            <div className="main-header">
                <nav className="main-header-nav">
                    <Link to={isLoggedIn ? "/home" : "/"}>
                        <h1>Animefoda</h1>
                    </Link>
                    <div className="search-container">
                        {/*<button onClick={() => this.toggleSearch()}>*/}
                        <FontAwesomeIcon icon={faMagnifyingGlass} color={'white'} cursor={'pointer'}/>
                        {/*</button>*/}

                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Buscar"
                            value={searchTerm}
                            onChange={this.inputChange}
                        />
                        {searchTerm && (
                            <></>
                            // <ul className="search-dropdown">
                            //     <li>sdfjna</li>
                            //     <li>sdfjna</li>
                            //     <li>sdfjna</li>
                            // </ul>
                        )}
                        {/*{searchVisible && (*/}
                        {/*    <>*/}


                        {/*        {searchTerm && (*/}
                        {/*            <ul className="search-dropdown">*/}
                        {/*                <li>Recomendação 1</li>*/}
                        {/*                <li>Recomendação 2</li>*/}
                        {/*                <li>Recomendação 3</li>*/}
                        {/*            </ul>*/}
                        {/*        )}*/}
                        {/*    </>*/}
                        {/*)}*/}
                    </div>

                    <div className="main-header-nav-link">
                        <div className="dropdown">
                            <p>Animes</p>
                            <div className="dropdown-content">
                                <Link to={"/anime/new"}>Novo <FontAwesomeIcon icon={faPlus}/></Link>
                            </div>
                        </div>
                        {isLoggedIn ? (
                            <button onClick={this.handleLogout}><FontAwesomeIcon icon={faRightFromBracket}/></button>
                        ): (
                            <Link to={"/"}><FontAwesomeIcon icon={faArrowRightToBracket}/></Link>
                        )}
                        {/*{isLoggedIn ? (*/}
                        {/*    window.location.pathname === "/user"?(*/}
                        {/*        <button onClick={this.handleLogout}><FontAwesomeIcon icon={faRightFromBracket}/></button>*/}
                        {/*    ):(*/}
                        {/*        <Link to={"/user"}><FontAwesomeIcon icon={faUser}/></Link>*/}
                        {/*    )*/}
                        {/*): (*/}
                        {/*    <Link to={"/login"}><FontAwesomeIcon icon={faArrowRightToBracket}/></Link>*/}
                        {/*)}*/}
                    </div>
                </nav>
            </div>
        )
    }
}