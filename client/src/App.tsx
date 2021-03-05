import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, createStyles } from '@material-ui/core/styles';
// @ts-ignore
import ShowMoreText from 'react-show-more-text';
import './App.scss';
import {createApiClient, Ticket} from './api';
import classes from '*.module.sass';

export type AppState = {
	tickets?: Ticket[], 
	search: string;
	pinTickets: Ticket[];
	pages:number;
	currentPage:number;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		pages:1,
		currentPage:1,
		pinTickets:[],
	}
	
	searchDebounce: any = null;

	async componentDidMount() {
		await this.getTickets(this.state.search,this.state.currentPage);
		// this.setState({
		// 	tickets : await api.getTickets(this.state.search,this.state.currentPage)
		// });
	}

	handlePinItem(ticket:Ticket) 
	{
		this.state.pinTickets.push(ticket);
		console.log(this.state.pinTickets);
	}

	renderTickets = (tickets: Ticket[]) => {
		console.log("renderTickets");

		return (
			//show pinned first 

			//don't show pinned 
		<ul className='tickets'>
			{tickets.map((ticket) => (<li key={ticket.id} className='ticket'>
			{/* <button type="button" onClick={this.onClickFunc(ticket.id)}>Click Me!</button> */}
				<button className='pinned' onClick={this.handlePinItem.bind(this, ticket)}>pin</button>
				<h5 className='title'>{ticket.title}</h5>
				<ShowMoreText
                	lines={3} 
                	more='See more'
                	less='See less'
					className='content'
					
            	>
                {ticket.content}
            	</ShowMoreText>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					
				</footer>
			</li>))}
		</ul>);
	}
	async getTickets (search:string,page:number) {
		const response = await api.getTickets(search, page);
		this.setState({
			search: search,
			tickets: response.tickets,
			currentPage: page,
			pages: response.numOfPages
		})
	}

	onSearch = async (val: string, newPage?: number) => {
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			// this.setState({
			// 	search: val,
			// 	tickets: await api.getTickets(val,1),
			// 	currentPage:1
			// });
			await this.getTickets(val, 1);
		}, 300);
	}

	async handlePageChange (event: any ,value : number) {
		await this.getTickets(this.state.search, value);
	//    this.setState({
	// 	   currentPage : value,
	// 	   tickets : await api.getTickets(this.state.search,value)
	// 	});
		window.scrollTo(0, 0);
   };
// 
	render() {	
		const {tickets} = this.state;
		//const classes = this.useStyles();
		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<footer>
				<Pagination id='Pagination' onChange={this.handlePageChange.bind(this)} page={this.state.currentPage} count={this.state.pages} defaultPage={1} boundaryCount={2}/>
			</footer>
		</main>)
	}

	useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			'& > *': {
			  backgroundColor: 'transparent',
			  color:'#19D5C6',
			 },
		},
	  }),
	);

}




export default App;