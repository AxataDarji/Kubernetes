provider "google" {
  project = "kubernetes-428712"
  region  = "us-central1"
}

resource "google_container_cluster" "primary" {
  name               = "primary-cluster"
  location           = "us-central1"
  initial_node_count = 1

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}
