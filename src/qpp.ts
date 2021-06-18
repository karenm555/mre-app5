/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
	private ego: MRE.Actor = null; // ego: empty game object
	private soundPanel: MRE.Actor = null; // kit item sound panel
	private panelButton: MRE.Actor = null; // kit item panel button
	private buttonTransformText: MRE.Actor = null; // text object to diplay panel button transform
	private xPosButton: number = null;
	private yPosButton: number = null;
	private zPosButton: number = null;
	private button: MRE.Actor;
	private assets: MRE.AssetContainer;

	constructor(private context: MRE.Context) {
		this.context.onStarted(() => this.started());
	}

	/**
	 * Once the context is "started", initialize the app.
	 */
	private started() {
		
		// set up somewhere to store loaded asset
		//(meshes, textures, animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);
	
		// create an empty game object (ego) to attach sound to
		this.ego = MRE.Actor.Create(this.context);
		
		// create Sound Panel from kit
		this.soundPanel = MRE.Actor.CreateFromLibrary(this.context, {
			resourceId: `artifact:1759289461268546093` // sound panel
		});

		// create panel button from kit
		this.panelButton = MRE.Actor.CreateFromLibrary(this.context,
			{
				resourceId: `artifact:1759289475034251828`, // panel button
				actor: {
					name: `panel button`,
					// Parent the panel button to the sound panel so it's transform is relative to the panel
					parentId: this.soundPanel.id,
					collider: { geometry: { shape: MRE.ColliderType.Sphere }},
					transform: {
						local: {
							position: { x: 0, y: 1, z: 0},
							scale: { x: 5, y: 5, z: 5}
						}
					}
				}
				
			});

		// create text to display panel button transform
		this.buttonTransformText = MRE.Actor.Create(this.context, {
			actor: {
				name: `Text display for button transform`,
				parentId: this.soundPanel.id,
				text: {
					contents: `Button position x = ${this.xPosButton}`
				} 
			}
		});

		// store button positions x, y, z
		this.xPosButton = this.buttonTransformText.transform.local.position.x;
		this.yPosButton = this.buttonTransformText.transform.local.position.y;
		this.zPosButton = this.buttonTransformText.transform.local.position.z;
			
		// create cube (primitive) to use for button
		this.button = MRE.Actor.CreatePrimitive(this.assets,
			{
				definition: { shape: MRE.PrimitiveShape.Box },
				actor: {
					transform: {
						local: {
							scale: { x: 1, y: 1, z: 1 }
						}
					},
					appearance: { enabled: false }
				},
				addCollider: true		/* Must have a collider for buttons. */
			}
		);

		// call the playSound function
		this.playSound();
		
		// call the button function
		this.panelButton.created().then(() =>
			this.panelButton.setBehavior(MRE.ButtonBehavior).onClick((user) => this.testButton(user)));

		// call the getPositionPanelButton function
		// need to 
	// 	this.getPositionPanelButton(x, y, z); // 
	}
	
	// declare playSound function
	private playSound() {
		const soundUrl = 'https://cdn-content-ingress.altvr.com/uploads/audio_clip/'
	+ 'audio/1752083042664448771/ogg_dors_open.ogg';
		const LanceSound1 = this.assets.createSound(
			'DoorsAreOpen', {uri: soundUrl});
		this.ego.startSound(LanceSound1.id, {volume: 1});
		console.log(`Sound plays when user enters!`);
	}
	
	// FUNCTION DECLARATIONS //
	// declare button function - this won't work if button is unclickable
	private testButton (user: MRE.User) {
		// this.button.appearance.enabled = true;
		// this.button.transform.local.scale.x = 2;
		console.log(`This statement before the PlaySound function`);
		this.playSound();
		console.log(`Sound plays when button clicked!`);
	}

	// declare function: get position of panel button
	// private getPositionPanelButton(x: number, y: number, z: number) {
	// 	x = this.panelButton.transform.local.position.x;
	// 	y = this.panelButton.transform.local.position.y;
	// 	z = this.panelButton.transform.local.position.z;
	// 	console.log(x, y, z);
	// }
	
		
}
