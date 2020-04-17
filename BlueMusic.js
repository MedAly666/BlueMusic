/*
	_____         	 ____		___				____					 ____
	|				\        	 |		|		|		|         |		|				  /		/
	|		|\	 \				 |		|		|		|			 	|		|			  /		/
	|		|	\   \			 |		|		|		|_____|		|	 	 /		/_______
	|		| 	 \   \		 |		|		|		 _____ 		|		/______			/
	|		|	    \   \   |		|		|		|				 |		|						   /		/
	|		| 	     \   \ |		|		|		|				 |		|				   	/		/
	|__|   	     \_____|		|__| 			   |__|				   /__/

											New Horizon Software 

															BlueMusic 1.0

		This source code is created by Med Aly under 
											Mozilla Public License

*/

//Called when application is started.
function OnStart(){
	app.SetOrientation( "portrait" );
	app.EnableBackKey( 0 );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "absolute" );	
	lay.SetSize( 1,1 );
	lay.SetBackColor( "#ffffff" );
//Add the icon of the app to the top of screen
	Icon = app.CreateImage( "Img/music(2).png", 0.1,0.07,"alias",5,5);
	Icon.SetPosition(0,0.001)
	Icon.SetBackColor("#0000ff")
	lay.AddChild( Icon );
//Add the name off theapp to the top of screen
	Title = app.CreateText( "	BlueMusic",0.8,0.07,"bold,left" );
	Title.SetTextSize( 25 );
	Title.SetBackColor( "#0000ff" );
	Title.SetTextColor( "#ffffff" );
	Title.SetPosition( 0.1,0 );
	lay.AddChild( Title );
//create button to show the menu
	btnMenu = app.CreateButton( "[fa-ellipsis-v]",0.1,0.07,"fontawesome");
	btnMenu.SetBackColor( "#0000ff" );
	btnMenu.SetPosition( 0.9,0 );
	btnMenu.SetOnTouch( btnMenu_OT );
	lay.AddChild( btnMenu );

	btnShowList= app.CreateButton( "[fa-arrow-right]",0.15,0.07,"fontawesome");
	btnShowList.SetTextColor( "#0000ff" );
	btnShowList.SetBackColor( "#ffffff" );
	btnShowList.SetPosition( 0.85,0.07 );
	btnShowList.SetOnTouch( btnShowList_OT );
	lay.AddChild( btnShowList );

	txtTitle = app.CreateText( "the name of the song",0.84,0.07,"multiline,autosize");
	txtTitle.SetPosition( 0.01,0.07 );
	txtTitle.SetTextColor( "#0000ff" );
	lay.AddChild( txtTitle );

	imgMusic = app.CreateImage( "Img/BlueMusic.png", 0.5 );
	imgMusic.SetPosition( 0.25,0.14 );
	lay.AddChild( imgMusic );

	txtInfo = app.CreateText( "",0.5,0.2,"multiline,autosize,left,fontawesome");
	txtInfo.SetPosition( 0.25,0.44 );
	txtInfo.SetTextColor( "#000000" );
	lay.AddChild( txtInfo );

	txtPos = app.CreateText( "03:45",0.15,0.06,"");
	txtPos.SetPosition( 0,0.7 );
	lay.AddChild( txtPos );

	skbMusic = app.CreateSeekBar( 0.7,0.06 );
	skbMusic.SetBackColor( "#ffffff" );
	skbMusic.SetPosition( 0.15,0.7 );
	skbMusic.SetColorFilter( "#0000ff" );
	skbMusic.SetRange( 1 );
	skbMusic.SetOnTouch( skbMusic_OT );
	lay.AddChild( skbMusic );

	txtDur = app.CreateText( "03:45",0.15,0.06,"");
	txtDur.SetPosition( 0.85,0.7 );
	lay.AddChild( txtDur );

	btnBack = app.CreateButton( "",0.15,0.1);
	btnBack.SetPosition( 0.1,0.79 );
	btnBack.SetOnTouch( btnBack_OT );
	btnBack.SetBackground( "Img/previous.png" );
	lay.AddChild( btnBack );

	btnPause = app.CreateButton( "",0.25,0.15);
	btnPause.SetPosition( 0.385,0.76 );
	btnPause.SetOnTouch( btnPause_OT);
	btnPause.SetBackground( "Img/pause.png" );
	lay.AddChild( btnPause );

	btnNext= app.CreateButton( "",0.15,0.1);
	btnNext.SetPosition( 0.75,0.79 );
	btnNext.SetBackColor( "#0000ff" );
	btnNext.SetBackground( "Img/next.png");
	btnNext.SetOnTouch( btnNext_OT );
	lay.AddChild( btnNext );

	lstMusic = app.CreateList( "",1,0.93);
	lstMusic.SetPosition( 0,0.07 );
	lstMusic.SetBackColor( "#eeeeee" );
	lstMusic.SetTextColor( "#000000" );
	lstMusic.SetDivider( 0.002,"#cccccc" );
	lstMusic.SetOnTouch( lstMusic_OT );
	lay.AddChild( lstMusic );

	//Add layout to app.	
	app.AddLayout( lay );
//	lay.Animate("FadeIn",null,1000 );

	layMenu = app.CreateLayout( "absolute" );
	layMenu.SetSize( 1,1 );
	layMenu.Hide();
	layMenu.SetOnTouch( layMenu_OT );
	lay.AddChild( layMenu );

	lstMenu = app.CreateList( "About::Img/about(2).png,Exit::Img/logout.png",0.4);
	lstMenu.SetIconSize(3,"mm")
	lstMenu.SetPosition( 0.59,0.01 );
	lstMenu.SetTextColor( "#000000" );
	lstMenu.SetBackColor( "#ffffff" );
	lstMenu.SetDivider( 0.002,"#ffffff" );
	lstMenu.SetOnTouch( lstMenu_OT );
	layMenu.AddChild( lstMenu );

	//Create media store and set callbacks.
	media = app.CreateMediaStore();
	media.QueryMedia( "","title","external");
	media.SetOnMediaResult( media_OnMediaResult );
//Create media player.
	player = app.CreateMediaPlayer();
	player.SetOnReady( player_R );
	player.SetOnComplete( player_C );
//Create notification objects.
	notify = app.CreateNotification("ongoing");
	notify.SetLargeImage( "Img/BlueMusic.png" );
	notify.SetSmallImage( "Img/music-note.png" );
}

//Show media query results.
function media_OnMediaResult( result ){
	file = ""
	size = ""
	title = ""
	artist = ""
	album = ""
	duration = ""
	ResArr = result
	result.forEach( function (item){
		if(item.size>=500000){
			lstMusic.AddItem( item.title,item.artist,"Img/music-note.png");
			title += item.title+"∞"
			artist += item.artist+"∞"
			album += item.album+"∞"
			file += item.uri+"?"
			size += item.size+","
			duration += item.duration+","
		}
	})
}

function lstMusic_OT(item,body,type,index){
//
	titleArr = title.split("∞")
	artistArr = artist.split("∞")
	albumArr = album.split("∞")
	info = "[fa-music]	"+titleArr[index]+"\n[fa-male]	"+artistArr[index]+"\n[fa-circle]	"+albumArr[index]
	txtInfo.SetText( info );
	
	durArr = duration.split(",")
	dur = Math.floor((durArr[index]/1000)/60)+":"+Math.floor(durArr[index]%60)
	txtDur.SetText( dur );

	txtTitle.SetText( item);

	lstMusic.Hide();

	fileArr = file.split("?")
	fileToPlay = fileArr[index]

	player.SetFile( fileToPlay  )
	dur_play = null
	//Start timer to update seek bar every second.
	setInterval( "Update()", 10 );
}

//Updat seek bar.
function Update() {
	prog = player.GetPosition();
	if(dur_play)skbMusic.SetValue( prog/dur_play );
	pos = Math.floor((prog)/60)+":"+Math.floor(prog%60)
	txtPos.SetText( pos );
}

function player_R(){
	dur_play = player.GetDuration();
	player.Play(  );
    notify.SetMessage( "","BlueMusic","");
notify.SetLights( "#0000ff", 500, 500 );
	notify.Notify();  
}

function player_C(){
	app.ShowPopup( "Done" );
}

function btnShowList_OT(){
	lstMusic.Show();
}

function skbMusic_OT( value )
{
	player.SeekTo( dur_play*value );
}

function btnMenu_OT(){
	layMenu.Show();
}

function layMenu_OT(){
	this.Hide()
}

function lstMenu_OT(item){
	layMenu.Hide();
			dlg = app.CreateDialog(  );
			dlg.SetBackColor( "#ffffff" );
			dlg.SetSize( 1,1 );
			
			layDlg = app.CreateLayout( "Linear", "VCenter" );
			layDlg.SetSize( 1,1 );
			dlg.AddLayout( layDlg );

	switch(item){
		case "Setting":


			break;
		case "About" :
			webAbout = app.CreateWebView( 1,1 );
			webAbout.LoadUrl( "About.html" );
			layDlg.AddChild( webAbout );
			
			dlg.Show();
	break;
	case "Exit" :
		player.Close();
		notify.Cancel(  );
		app.Exit(  );
	break;
	}
}

function btnPause_OT(){
	player.Pause();
	btnPause.SetBackground( "Img/play.png" );
	btnPause.SetOnTouch( btnPause_OT2 );
}

function btnPause_OT2(){
	player.Play( player.GetPosition() );
	btnPause.SetBackground( "Img/pause.png" );
	btnPause.SetOnTouch( btnPause_OT );
}

function btnNext_OT(){
	NextIndex = fileArr.indexOf(fileToPlay )+1
	fileToPlay = fileArr[NextIndex]
	player.SetFile( fileToPlay  )
	NextInfo = "[fa-music]	"+titleArr[NextIndex]+"\n[fa-male]	"+artistArr[NextIndex]+"\n[fa-circle]	"+albumArr[NextIndex]
	txtInfo.SetText( NextInfo );
	dur = Math.floor((durArr[NextIndex]/1000)/60)+":"+durArr[NextIndex]%60
	txtDur.SetText( dur );
	txtTitle.SetText( titleArr[NextIndex] );
}

function btnBack_OT(){
//	BackIndex = fileArr.indexOf(fileToPlay )-1
	fileToPlay = fileArr[BackIndex]
	player.SetFile( fileToPlay  )
	BackInfo = "[fa-music]	"+titleArr[BackIndex]+"\n[fa-male]	"+artistArr[BackIndex]+"\n[fa-circle]	"+albumArr[BackIndex]
	txtInfo.SetText( BackInfo );
	dur = Math.floor((durArr[BackIndex]/1000)/60)+":"+durArr[BackIndex]%60
	txtDur.SetText( dur );
	txtTitle.SetText( titleArr[BackIndex] );
media.SetOnAlbumsResult( media_OnAlbumsResult );
}
//Show albums query results.
/*function media_OnAlbumsResult( result ){
i=0
	result.forEach(function (item){
		lstMusic.AddItem( item.album+""+tem.album,item.artist,item.albumArt=="null"?"Img/music-note.png":item.albumArt );
	i++
})
app.ShowPopup( i );
}*/