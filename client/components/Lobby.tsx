import * as React from 'react';
import { onMatchStart, onUpdatePlayer } from './uiManager/Thunks'
import AppStyles from '../AppStyles';
import { TopBar, Button } from './Shared';
import { getTeamColor } from './Util'
import { PlayerRune } from '../../enum'

interface Props { 
    activeSession:Session
    currentUser:Player
}

export default class Lobby extends React.Component<Props> {

    startMatch = () => {
        onMatchStart(
            this.props.currentUser, 
            this.props.activeSession)
    }

    selectAvatar = (inc:number) => {
        let selectedIndex = Math.min(Math.max(0,this.state.selectedAvatarIndex+inc), PlayerRune.length-1)
        this.setState({selectedAvatarIndex: selectedIndex})
        this.chooseAvatar(PlayerRune[selectedIndex])
    }

    chooseAvatar = (avatar:string) => {
        let player = this.props.activeSession.players.find(player=>player.id === this.props.currentUser.id)
        player.rune = avatar
        onUpdatePlayer(player, this.props.activeSession)
    }

    getErrors = () => {
        if(this.props.activeSession.players.length < 4) return 'Waiting for more to join...'
        if(this.props.activeSession.players.length > 12) return 'Too many players in match...'
        if(this.props.activeSession.teams.find(team=>this.props.activeSession.players.filter(player=>player.teamId === team.id).length > 1)) return 'All teams need at least 2 players...'
        if(this.props.activeSession.teams.filter(team=>team.leadPlayerId).length === this.props.activeSession.teams.length) return 'Each team needs one leader...'
    }

    render(){
        return (
            <div>
                {TopBar('MacSecret')}
                <div style={{...AppStyles.window, padding:'0.5em'}}>
                    <h3>{this.props.activeSession.sessionId} Lobby</h3>
                    <div style={{marginBottom:'1em', alignItems:'center', overflow:'auto', maxHeight:'66vh'}}>
                        {this.props.activeSession.players.map((player:Player) => 
                            <div style={{...styles.nameTag, background: getTeamColor(player.teamId, this.props.activeSession.teams)}}>
                                <select value={player.teamId} 
                                        onChange={(e)=>onUpdatePlayer({...player, teamId: e.currentTarget.value}, this.props.activeSession)}>
                                    {this.props.activeSession.teams.map(team=><option value={team.id}>{team.color}</option>)}
                                </select>
                                <div style={{display:'flex'}}>
                                    <div style={{cursor:'pointer'}} onClick={()=>this.selectTeam(-1)}>{'<'}</div>
                                    <div>{player.name}</div>
                                    <div style={{cursor:'pointer'}} onClick={()=>this.selectTeam(1)}>></div>
                                </div>
                                <div style={{display:'flex'}}>
                                    <div style={{cursor:'pointer'}} onClick={()=>this.selectAvatar(-1)}>{'<'}</div>
                                    <div style={{fontFamily:'Rune'}}>{player.rune}</div>
                                    <div style={{cursor:'pointer'}} onClick={()=>this.selectAvatar(1)}>></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>{this.getErrors()}</div>
                    {Button(!!this.getErrors(), this.startMatch, 'Start')}
                </div>
            </div>
            
        )
    }
}

const styles = {
    nameTag: {
        background: 'white',
        border: '1px solid',
        width: '100%',
        padding: '0.25em',
        marginBottom: '5px',
        minWidth:'10em'
    }
}