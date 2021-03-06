import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
// @ts-ignore
import ShowMoreText from 'react-show-more-text';
import './App.scss';
import { createApiClient, Ticket } from './api';
import CreateTicketContainer from "./CreateTicketForm/CreateTicketContainer";
import generateID from './helpers/generateID';

export type AppState = {
	tickets?: Ticket[],
	search: string;
	pinTickets: Set<string>;
	pages: number;
	currentPage: number;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	state: AppState = {
		search: '',
		pages: 1,
		currentPage: 1,
		pinTickets: new Set<string>(),
	}

	searchDebounce: any = null;

	async componentDidMount() {
		await this.getTickets(this.state.search, this.state.currentPage);
	}

	handlePinItem(ticket: Ticket) {
		const updatedTickets = new Set(this.state.pinTickets)
		if (this.state.pinTickets.has(ticket.id))
			updatedTickets.delete(ticket.id);
		else updatedTickets.add(ticket.id);
		this.setState({ pinTickets: updatedTickets });
	}

	getOrderedTickets() {
		return this.state.tickets ? (this.state.tickets.sort((a, b) => {
			if (this.state.pinTickets.has(a.id))
				return -1;
			if (this.state.pinTickets.has(b.id))
				return 1;
			return 0;
		})) : [];
	}

	renderTickets = (tickets: Ticket[]) => {
		const orderdTickets: Ticket[] = this.getOrderedTickets();
		return (
			<ul className='tickets'>
				{ orderdTickets.map((ticket) => {
					return (
						<li key={ticket.id} className='ticket' >
							<div className='header'>
								<h5 className='title'>{ticket.title}</h5>
								<div className='pinned'>
									<button onClick={this.handlePinItem.bind(this, ticket)}>{this.state.pinTickets.has(ticket.id) ? 'unpin' : 'pin'}</button>
								</div>
							</div>
							<ShowMoreText
								lines={3}
								more='See more'
								less='See less'
								className='content'
							>
								{ticket.content}
							</ShowMoreText>
							<footer>
								<div className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
								<div className='tags'>
									{ticket.labels ?
										(ticket.labels.map((label: String) =>
											<label key={label as string} className='tag'>{label}</label>)) : null
									}
								</div>
							</footer>
						</li>
					)
				})}
			</ul>
		);
	}

	async getTickets(search: string, page: number) {
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
			await this.getTickets(val, 1);
		}, 300);
	}

	async handlePageChange(event: any, value: number) {
		await this.getTickets(this.state.search, value);
		window.scrollTo(0, 0);
	};

	handleAddTicket = (event: any) => {
		event.preventDefault(event);
		const currentTime = new Date().getTime();
		const labels: string[] = event.target.labels.value === '' ? [] : (event.target.labels.value).split(',');
		const title = event.target.title.value;
		const content = event.target.content.value;
		const email = event.target.email.value;

		if (!email || !title || !content) alert("upload failed! \r\n email,title and content are required fields")

		else {
			const ticket: Ticket = {
				id: generateID(), title: title, content: content,
				userEmail: email, creationTime: currentTime, labels: labels
			};
			this.addNewTicketAPICall(ticket);
		}
	};

	async addNewTicketAPICall(ticket: Ticket) {
		const response = await api.addTicket(ticket, this.state.currentPage);
		this.setState({
			tickets: response.tickets,
			pages: response.numOfPages
		})
	}

	render() {
		const { tickets } = this.state;
		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input id='search' type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null}
			<CreateTicketContainer triggerText="Create new ticket" onSubmit={this.handleAddTicket} />
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<footer>
				<Pagination id='Pagination' onChange={this.handlePageChange.bind(this)} page={this.state.currentPage} count={this.state.pages} defaultPage={1} boundaryCount={2} />
			</footer>
		</main>)
	}

}


export default App;