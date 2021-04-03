import React from "react";
import * as THREE from 'three-full';
import { DDSLoader } from 'three-full/sources/loaders/DDSLoader';
import { MTLLoader } from 'three-full/sources/loaders/MTLLoader';
import { OBJLoader } from 'three-full/sources/loaders/OBJLoader';
import { Spin } from "antd";
import styles from './obj-loader.module.less';

interface Props {
  objSrc: string;
  mtlSrc: string;
  width?: number;
  height?: number;
}

interface State {
  modelLoaded: boolean;
}

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html
class ObjLoader extends React.Component<Props, State>{
  private containerRef = React.createRef<HTMLDivElement>();
  private scene: any;
  private camera: any;
  private renderer: any;
  private frameId: any;
  private controls: any;

  private helperRef = React.createRef<HTMLDivElement>();
  private helperRender: any;
  private helperScene: any;
  private helperCamera: any;

  get ref() {
    return this.containerRef.current as HTMLDivElement;
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      modelLoaded: false
    }
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    this.camera = new THREE.PerspectiveCamera(60, this.ref.clientWidth / this.ref.clientHeight, 1, 1000);
    this.camera.position.set(400, 200, 0);

    // scene
    this.scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    this.camera.add(pointLight);
    this.scene.add(this.camera);
    THREE.Loader.Handlers.add(/\.dds$/i, new DDSLoader());

    new MTLLoader()
      .load(this.props.mtlSrc, (materials: any) => {
        materials.preload();
        new OBJLoader()
          .setMaterials(materials)
          .load(this.props.objSrc, (object: any) => {
            object.scale.x = 1.5;
            object.scale.y = 1.5;
            object.scale.z = 1.5;
            this.scene.add(object);
            this.camera.lookAt(object.position);
            const objectCenter = this.getCenterPoint(object);
            this.controls.target.set(objectCenter.x, objectCenter.y, objectCenter.z);
            this.setState({modelLoaded: true});
          });
      });
    //
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.ref.clientWidth, this.ref.clientHeight);
    this.ref.appendChild(this.renderer.domElement);

    this.ref.appendChild(this.renderer.domElement);

    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);

    // helper
    this.setHelperRender();
    this.start();
  }

  componentWillUnmount() {
    this.stop()
    this.ref.removeChild(this.renderer.domElement);
    (this.helperRef.current as any).removeChild(this.helperRender.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    // there is a rotate issue
    // https://www.chromestatus.com/features/6662647093133312
    this.renderScene();

    this.helperCamera.position.copy(this.camera.position);
    this.helperCamera.position.sub(this.controls.target);
    this.helperCamera.position.setLength(300);
    this.helperCamera.lookAt(this.helperScene.position);

    this.frameId = requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.helperRender.render(this.helperScene, this.helperCamera);
  }

  render() {
    const {modelLoaded} = this.state;
    const {width, height} = this.props;
    const dimension = { width: width || 500, height: height || 300 };

    return (
      <div style={dimension} className={styles['wrapper']}>
        <div style={{...dimension, display: modelLoaded ? 'none' : 'flex'}} className={styles['spinner']}><Spin /></div>
        <div
          style={dimension}
          ref={this.containerRef}
        />

        <div ref={this.helperRef} className={styles['wrapper__helper']} style={{opacity: modelLoaded ? 1 : 0}}/>
      </div>
    )
  }

  private setHelperRender() {

    // renderer
    this.helperRender = new THREE.WebGLRenderer({ alpha: true });
    this.helperRender.setClearColor(0xffffff, 0);
    this.helperRender.setSize(75, 75);
    (this.helperRef.current as HTMLDivElement).appendChild(this.helperRender.domElement);

    // scene
    this.helperScene = new THREE.Scene();

    // camera
    this.helperCamera = new THREE.PerspectiveCamera(50, 75 / 75, 1, 1000);
    this.helperCamera.up = this.camera.up; // important!

    // axes helper
    this.helperScene.add(new THREE.AxesHelper(100));
  }

  private getCenterPoint(object: any): {x: number, y: number, z: number} {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    return center;
  }
}

export default ObjLoader;