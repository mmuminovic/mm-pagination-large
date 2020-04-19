import React, { Component } from "react";
import {
  Row,
  Col,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import dummyUsers from "./users.json";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      page: null,
      usersPerPage: 9,

      // Dummy users
      users: [...dummyUsers],
      filteredUsers: [],
      usersOnPage: [],
    };
  }

  componentDidMount() {
    const shuffledUsers = this.shuffle(dummyUsers);
    this.setState(
      {
        ...this.state,
        users: [...shuffledUsers],
      },
      () => {
        this.changePageHandler(0);
      }
    );
  }

  // If you want to shuffle results
  shuffle = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  changePageHandler = (i) => {
    let { users, usersPerPage } = this.state;
    let usersOnPage = users.slice(i * usersPerPage, (i + 1) * usersPerPage);
    this.setState({
      ...this.state,
      page: i,
      usersOnPage: [...usersOnPage],
    });
  };

  render() {
    let { usersOnPage, page, usersPerPage, users } = this.state;

    let paginationItems = [];
    let numberOfPages = users.length / usersPerPage;
    numberOfPages = Math.ceil(numberOfPages);

    // First and last numbers displayed in pagination bar
    let firstOfNums, lastOfNums;
    if (numberOfPages > 5 && page >= 4) {
      firstOfNums = page - 3;
      lastOfNums = page < numberOfPages - 1 ? page + 1 : page;
    } else if (numberOfPages > 5 && page < 4) {
      firstOfNums = 0;
      lastOfNums = 4;
    } else {
      firstOfNums = 0;
      lastOfNums = numberOfPages - 1;
    }

    for (let i = firstOfNums; i <= lastOfNums; i++) {
      const paginationItem = (
        <PaginationItem
          active={i === page}
          key={i}
          onClick={() => this.changePageHandler(i)}
        >
          <PaginationLink href="#">{i + 1}</PaginationLink>
        </PaginationItem>
      );
      paginationItems.push(paginationItem);
    }

    usersOnPage =
      usersOnPage &&
      usersOnPage.map((user, i) => {
        return (
          <Col lg="4" className="pr-0 mb-2" key={i}>
            <div className="card">
              <div
                className="card__image"
                style={{ backgroundImage: `url(${user.photo})` }}
              >
                &nbsp;
              </div>
              <div className="card__details">
                <p className="card__details--name">
                  {user.first_name} {user.last_name}
                </p>
                <p className="card__details--location">
                  {user.country} {user.city}
                </p>
                <p>{this.getAge(user.date_of_birth)} years</p>
                <p>{user.gender}</p>
              </div>
            </div>
          </Col>
        );
      });

    return (
      <div className="container mt-lg-5">
        <div className="row">
          <div className="content text-center mt-lg-5 find-members">
            <Row>
              <Col md="12">
                <h3>Enter number of users per page</h3>
                <Input
                  name="usersPerPage"
                  type="number"
                  onChange={(e) => {
                    console.log(e.target.value);
                    this.setState({ usersPerPage: e.target.value }, () => {
                      this.changePageHandler(0);
                    });
                  }}
                  value={usersPerPage}
                />
              </Col>
            </Row>
            <Row className="ml-auto mr-auto mt-5">{usersOnPage}</Row>
            <Row className="mt-5">
              <Col md="12">
                <Pagination aria-label="Page navigation example">
                  <PaginationItem disabled={page === 0}>
                    <PaginationLink
                      first
                      href="#"
                      onClick={() => this.changePageHandler(0)}
                    />
                  </PaginationItem>
                  <PaginationItem disabled={page === 0}>
                    <PaginationLink
                      previous
                      href="#"
                      onClick={() => this.changePageHandler(page - 1)}
                    />
                  </PaginationItem>
                  {paginationItems}
                  <PaginationItem disabled={page === numberOfPages - 1}>
                    <PaginationLink
                      next
                      href="#"
                      onClick={() => this.changePageHandler(page + 1)}
                    />
                  </PaginationItem>
                  <PaginationItem disabled={page === numberOfPages - 1}>
                    <PaginationLink
                      last
                      href="#"
                      onClick={() => this.changePageHandler(numberOfPages - 1)}
                    />
                  </PaginationItem>
                </Pagination>
                <p>Number of pages: {numberOfPages}</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
