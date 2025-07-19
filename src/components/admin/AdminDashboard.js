import React from "react";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";

function AdminDashboard() {
  const { user, token } = useSelector((state) => state.user);

  return (
    <Card className="welcome-card">
      <Card.Body>
        <h2>Developer Portal Dashboard</h2>
      </Card.Body>
      <p>
        Welcome to the developer portal. Here you can manage and view the latest
        trends for our website!
      </p>
      {user && token && user.userType === "admin" && (
        <section className="logged-in-content">
          <div>
            <h5>Current Website Logs</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              blandit diam quis lorem efficitur, a condimentum odio iaculis.
              Cras eleifend quam sem, euismod fermentum sapien ultrices vel. Nam
              nisl elit, iaculis sit amet mauris eget, consectetur gravida
              turpis. Sed in nulla ultrices nulla fringilla ullamcorper ut non
              tortor. Sed ut interdum nulla, a pulvinar urna. Fusce lobortis
              accumsan odio, ut commodo turpis fermentum eget. Vivamus gravida
              ante sit amet massa rutrum placerat. Nulla vel libero at nisl
              pulvinar interdum at quis justo. Mauris sed nisl ut nunc placerat
              consectetur sit amet non lorem. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos.
              Integer eleifend dapibus massa eu consequat. Quisque aliquam
              blandit lacus, sed laoreet turpis cursus sit amet. Curabitur
              sollicitudin dolor vel justo pharetra porta. Nullam pretium
              sollicitudin felis, eget accumsan lacus. Curabitur tristique quam
              et lorem mattis, sed luctus urna semper.
            </p>
          </div>
          <div>
            <h5>Current Popular Searches</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              blandit diam quis lorem efficitur, a condimentum odio iaculis.
              Cras eleifend quam sem, euismod fermentum sapien ultrices vel. Nam
              nisl elit, iaculis sit amet mauris eget, consectetur gravida
              turpis. Sed in nulla ultrices nulla fringilla ullamcorper ut non
              tortor. Sed ut interdum nulla, a pulvinar urna. Fusce lobortis
              accumsan odio, ut commodo turpis fermentum eget. Vivamus gravida
              ante sit amet massa rutrum placerat. Nulla vel libero at nisl
              pulvinar interdum at quis justo. Mauris sed nisl ut nunc placerat
              consectetur sit amet non lorem. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos.
              Integer eleifend dapibus massa eu consequat. Quisque aliquam
              blandit lacus, sed laoreet turpis cursus sit amet. Curabitur
              sollicitudin dolor vel justo pharetra porta. Nullam pretium
              sollicitudin felis, eget accumsan lacus. Curabitur tristique quam
              et lorem mattis, sed luctus urna semper.
            </p>
          </div>
          <div>
            <h5>Most Bought Products</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              blandit diam quis lorem efficitur, a condimentum odio iaculis.
              Cras eleifend quam sem, euismod fermentum sapien ultrices vel. Nam
              nisl elit, iaculis sit amet mauris eget, consectetur gravida
              turpis. Sed in nulla ultrices nulla fringilla ullamcorper ut non
              tortor. Sed ut interdum nulla, a pulvinar urna. Fusce lobortis
              accumsan odio, ut commodo turpis fermentum eget. Vivamus gravida
              ante sit amet massa rutrum placerat. Nulla vel libero at nisl
              pulvinar interdum at quis justo. Mauris sed nisl ut nunc placerat
              consectetur sit amet non lorem. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos.
              Integer eleifend dapibus massa eu consequat. Quisque aliquam
              blandit lacus, sed laoreet turpis cursus sit amet. Curabitur
              sollicitudin dolor vel justo pharetra porta. Nullam pretium
              sollicitudin felis, eget accumsan lacus. Curabitur tristique quam
              et lorem mattis, sed luctus urna semper.
            </p>
          </div>
        </section>
      )}
    </Card>
  );
}

export default AdminDashboard;
