import React from 'react';
// @ts-ignore
import ShowMoreText from 'react-show-more-text';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[], 
	search: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: ''
	}
	
	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets(this.state.search)
		});
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets;
			//.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
			{/* <button type="button" onClick={this.onClickFunc(ticket.id)}>Click Me!</button> */}
				<h5 className='title'>{ticket.title}</h5>
				<ShowMoreText
                	lines={3} 
                	more='See more'
                	less='See less'
					className='content'
					//  onClick={this.onClickFunc(ticket.id)}
            	>
                {ticket.content}
            	</ShowMoreText>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}
	
	 onClickFunc(id: string){
		console.log(id);
	 }
	

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val,
				tickets: await api.getTickets(val)
			});
		}, 300);
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;