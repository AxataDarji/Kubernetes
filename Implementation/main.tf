# Configure GCP provider
provider "google" {
  project = "kubernetes-428712"
  region  = "us-central1"
}

resource "google_container_cluster" "my_cluster" {
  name     = "k8s-gke-cluster"
  location = "us-central1-c"
  enable_autopilot=false
  initial_node_count=1


  node_config {
    machine_type = "e2-small"       #“e2-micro (2 vCPU, 1GB memory) for Machine type.
    disk_type = "pd-standard"       #“Standard persistent disk” for Boot disk type.
    disk_size_gb = 10               #“10” for Boot disk size.
    image_type = "COS_CONTAINERD"   #“container-Optimized OS with containerd (cos_containerd) (default)” as the image type for the node.
    oauth_scopes        = ["https://www.googleapis.com/auth/cloud-platform"]
  }
  }