import type { VehicleBidListItem, VehicleBidStatus } from '@drivewise/common-data';
import { EmptyState } from '@drivewise/react-ui';
import { useState } from 'react';
import styled from 'styled-components';
import { useBidListQuery } from './bid-list-query';
import type { BidListPageProps } from './types';
import { useVehicleActivity } from './use-vehicle-activity';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-US');
const dateTime = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function BidListPage({ onViewVehicle }: BidListPageProps) {
  const query = useBidListQuery();
  if (query.isLoading) return <EmptyState eyebrow="Bids" title="Loading active bids"><p>Checking the mock bid desk.</p></EmptyState>;
  if (query.isError) return <EmptyState eyebrow="Bids unavailable" title="We could not load active bids"><button type="button" onClick={() => query.refetch()}>Try again</button></EmptyState>;
  const bids = query.data ?? [];
  return <Page>
    <Hero aria-labelledby="bids-title"><Eyebrow>Bids</Eyebrow><h1 id="bids-title">Track active mock vehicle bids.</h1><p>Review each active bid, dealer response, and live listing signal in one place.</p></Hero>
    <Panel aria-live="polite"><header><Eyebrow>Bid list</Eyebrow><h2>{bids.length} active bids</h2></header>
      {bids.length === 0 ? <EmptyState eyebrow="Bid list" title="No active bids"><p>Place a mock bid from a vehicle detail page to see it tracked here.</p></EmptyState> :
        <CardList>{bids.map((bid) => <BidVehicleCard bid={bid} key={bid.id} onViewVehicle={onViewVehicle} />)}</CardList>}
    </Panel>
  </Page>;
}

function BidVehicleCard({ bid, onViewVehicle }: { bid: VehicleBidListItem; onViewVehicle(id: string): void }) {
  const { vehicle } = bid;
  const activity = useVehicleActivity(vehicle);
  const [expanded, setExpanded] = useState(false);
  const buffer = bid.maxAutoBid - bid.amount;
  return <Card $highlighted={vehicle.highlighted}>
    <Media><img src={vehicle.imageUrl} alt={vehicle.imageAlt} loading="lazy" />{vehicle.highlighted && <Badge>Featured match</Badge>}<MediaMeta>{vehicle.bodyStyle} - {vehicle.drivetrain}</MediaMeta></Media>
    <Body><Title><div><p>{vehicle.year} {vehicle.make}</p><h3>{vehicle.model} {vehicle.trim}</h3><span>{vehicle.dealerName} - Rated {vehicle.rating}</span></div><strong>{currency.format(vehicle.price)}</strong></Title>
      <Facts><Fact label="Mileage" value={`${number.format(vehicle.mileage)} mi`} /><Fact label="Fuel" value={vehicle.fuelType} /><Fact label="Location" value={`${vehicle.location.city}, ${vehicle.location.state}`} /><Fact label="Distance" value={`${vehicle.location.distanceMiles} mi away`} /></Facts>
      <BidSummary $status={bid.status} aria-label="Bid summary"><SummaryHeader><div><Eyebrow>Bid desk</Eyebrow><h4>{bidHeadline(bid.status)}</h4></div><Status>{bidStatusLabel(bid.status)}</Status></SummaryHeader>
        <Metrics><Fact label="Your bid" value={currency.format(bid.amount)} /><Fact label="Max auto bid" value={currency.format(bid.maxAutoBid)} /><Fact label="Bid rank" value={`#${bid.rank} of ${bid.competingBids + 1}`} /><Fact label="Expires" value={dateTime.format(new Date(bid.expiresAt))} /></Metrics>
        <Guidance $urgent={bid.status === 'outbid' || bid.status === 'countered'}>{bidGuidance(bid, buffer)}</Guidance>
      </BidSummary>
      <Activity aria-label="Live dealer activity"><SummaryHeader><div><Eyebrow>Mock websocket</Eyebrow><h4>{activity.connection === 'reconnecting' ? 'Reconnecting to dealer activity' : activity.connection === 'connecting' ? 'Connecting to dealer activity' : 'Live dealer activity'}</h4></div><Dot $live={activity.connection === 'live'} /></SummaryHeader>
        <Callout>{activity.marketSignal === 'price-drop' ? `Price movement detected: ${currency.format(activity.priceDelta)} since opening.` : activity.marketSignal === 'high-demand' ? `High shopper demand with ${number.format(activity.watchers)} active watchers.` : activity.marketSignal === 'reserved' ? 'Appointment activity changed the availability signal.' : 'Steady listing activity from the mocked dealer feed.'}</Callout>
        <Metrics><Fact label="Watching" value={number.format(activity.watchers)} /><Fact label="Saves today" value={number.format(activity.savesToday)} /><Fact label="Price pulse" value={currency.format(activity.priceDelta)} /></Metrics>
        <Toggle type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Hide live feed' : 'Show live feed'}</Toggle>
        {expanded && <Feed>{activity.recentEvents.length ? activity.recentEvents.map((event) => <li key={event.id}><strong>{event.label}</strong><small>event {event.sequence}</small></li>) : <li>Waiting for the first dealer event.</li>}</Feed>}
      </Activity>
      <Tags>{vehicle.tags.map((tag) => <span key={tag}>{tag}</span>)}</Tags>
      <Details type="button" onClick={() => onViewVehicle(vehicle.id)}>View details</Details>
    </Body>
  </Card>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
function bidStatusLabel(status: VehicleBidStatus) { return ({ winning: 'Winning bid', outbid: 'Outbid', countered: 'Dealer countered', watching: 'Watching auction' })[status]; }
function bidHeadline(status: VehicleBidStatus) { return ({ winning: 'You are leading this bid', outbid: 'Your bid needs attention', countered: 'Dealer sent a counteroffer', watching: 'You are watching this bid' })[status]; }
function bidGuidance(bid: VehicleBidListItem, buffer: number) {
  if (bid.status === 'outbid') return `Another shopper moved ahead. Increase by at least ${currency.format(buffer + 250)} to challenge.`;
  if (bid.status === 'countered') return `Dealer counter: ${currency.format(bid.dealerCounterOffer ?? bid.amount)}. Accept or keep your current max bid.`;
  if (bid.status === 'winning') return `Your auto-bid buffer is ${currency.format(buffer)} above the current bid.`;
  return `Bid placed ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(bid.placedAt))}. We are watching dealer updates.`;
}

const colors = { ink: '#14213d', muted: '#52616f', soft: '#627d98', line: '#d9e2ec', accent: '#0f766e', accentSoft: '#e6f4f1' };
const Page = styled.main`display:grid;gap:1.5rem;`;
const Hero = styled.section`background:linear-gradient(90deg,rgb(20 33 61/.92),rgb(15 118 110/.76)),url("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1600&q=80") center/cover;border-radius:.75rem;color:white;padding:clamp(1.5rem,5vw,3rem);h1{font-size:clamp(2.2rem,6vw,4.25rem);line-height:1;margin:.45rem 0 .75rem;max-width:11ch}p{color:#d9fbf4;line-height:1.7;margin:0;max-width:64ch}`;
const Eyebrow = styled.p`color:${colors.accent};font-size:.75rem;font-weight:900;letter-spacing:.1em;margin:0;text-transform:uppercase;`;
const Panel = styled.section`display:grid;gap:1rem;h2{margin:0}`; const CardList = styled.div`display:grid;gap:1rem;`;
const Card = styled.article<{ $highlighted: boolean }>`background:white;border:1px solid ${({$highlighted})=>$highlighted?'rgb(245 158 11/.45)':colors.line};border-radius:.75rem;display:grid;grid-template-columns:minmax(220px,.38fr) minmax(0,1fr);overflow:hidden;transition:transform 180ms,box-shadow 180ms;&:hover{box-shadow:0 1rem 2.5rem rgb(20 33 61/.1);transform:translateY(-2px)}@media(max-width:900px){grid-template-columns:1fr}`;
const Media = styled.div`background:${colors.ink};min-height:15rem;overflow:hidden;position:relative;img{height:100%;object-fit:cover;width:100%}@media(max-width:900px){min-height:0;img{aspect-ratio:16/9}}`;
const Badge = styled.span`background:rgb(255 255 255/.92);border-radius:999px;color:${colors.ink};font-size:.78rem;font-weight:900;left:.85rem;padding:.45rem .7rem;position:absolute;top:.85rem;`;
const MediaMeta = styled(Badge)`background:rgb(20 33 61/.78);bottom:.85rem;color:white;top:auto;`;
const Body = styled.div`display:grid;gap:1rem;padding:clamp(1rem,2vw,1.25rem);`; const Title = styled.div`display:grid;gap:1rem;grid-template-columns:1fr auto;h3{color:${colors.ink};font-size:1.4rem;margin:0}p{color:${colors.muted};font-size:.78rem;font-weight:800;margin:0;text-transform:uppercase}span{color:${colors.soft};font-size:.9rem}strong{color:${colors.accent};font-size:1.4rem}@media(max-width:640px){grid-template-columns:1fr}`;
const Facts = styled.dl`display:grid;gap:.75rem;grid-template-columns:repeat(4,1fr);margin:0;div{background:#f7f9fb;border-radius:.5rem;padding:.75rem}dt{color:${colors.soft};font-size:.7rem;font-weight:900;text-transform:uppercase}dd{color:${colors.ink};font-weight:800;margin:.25rem 0 0}@media(max-width:1100px){grid-template-columns:repeat(2,1fr)}@media(max-width:640px){grid-template-columns:1fr}`;
const BidSummary = styled.section<{ $status: VehicleBidStatus }>`background:#f7f9fb;border:1px solid ${colors.line};border-left:.35rem solid ${({$status})=>$status==='winning'?'#16a34a':$status==='outbid'?'#b45309':$status==='countered'?'#f59e0b':colors.accent};border-radius:.65rem;display:grid;gap:.85rem;padding:.85rem;`;
const SummaryHeader = styled.div`align-items:start;display:flex;gap:1rem;justify-content:space-between;h4{color:${colors.ink};font-size:1rem;margin:.2rem 0 0}`; const Status = styled.strong`background:${colors.accentSoft};border-radius:999px;color:${colors.accent};font-size:.78rem;padding:.45rem .7rem;white-space:nowrap;`; const Metrics = styled(Facts)`grid-template-columns:repeat(4,1fr);@media(max-width:640px){grid-template-columns:1fr}`;
const Guidance = styled.p<{ $urgent: boolean }>`background:${({$urgent})=>$urgent?'#fff7ed':'rgb(230 244 241/.75)'};border-radius:.5rem;color:${({$urgent})=>$urgent?'#b45309':colors.accent};font-weight:800;margin:0;padding:.7rem .8rem;`;
const Activity = styled.section`background:linear-gradient(135deg,rgb(230 244 241/.9),rgb(247 249 251/.94));border:1px solid #99d8ce;border-radius:.65rem;display:grid;gap:.85rem;padding:.85rem;`; const Dot = styled.span<{ $live:boolean }>`background:${({$live})=>$live?colors.accent:'#f59e0b'};border-radius:50%;height:.85rem;width:.85rem;`; const Callout = styled.p`background:rgb(255 255 255/.82);border-left:.25rem solid ${colors.accent};border-radius:.5rem;color:${colors.muted};font-weight:800;margin:0;padding:.7rem .8rem;`;
const Toggle = styled.button`background:none;border:0;color:${colors.ink};cursor:pointer;font-weight:900;justify-self:start;padding:0;text-decoration:underline;`; const Feed = styled.ol`display:grid;gap:.45rem;list-style:none;margin:0;padding:0;li{background:white;border:1px solid ${colors.line};border-radius:.5rem;display:grid;padding:.65rem}small{color:${colors.soft};text-transform:uppercase}`;
const Tags = styled.div`display:flex;flex-wrap:wrap;gap:.45rem;span{background:${colors.accentSoft};border-radius:999px;color:${colors.accent};font-size:.78rem;font-weight:900;padding:.45rem .7rem}`; const Details = styled.button`background:none;border:0;color:${colors.ink};cursor:pointer;font-weight:900;justify-self:start;padding:0;text-decoration:underline;text-underline-offset:.25rem;`;
