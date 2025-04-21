const Package=require('../Models/job.model')

async function getPackages(req, res) {
  try {
    
    const filters = {};


    if (req.query.price_gte || req.query.price_lte) {
      filters.price = {};
      if (req.query.price_gte)  filters.price.$gte = Number(req.query.price_gte);
      if (req.query.price_lte && req.query.price_lte !== 'Above')
        filters.price.$lte = Number(req.query.price_lte);
    }

    if (req.query.duration) {
      filters.duration = req.query.duration;
    }

    if (req.query.destination) {
      filters.destination = new RegExp(req.query.destination, 'i');
    }


    let query = Package.find(filters);


    if (req.query._sort) {
      const order = req.query._order === 'desc' ? -1 : 1;
      query = query.sort({ [req.query._sort]: order });
    }

    // Execute and return
    const packages = await query.exec();
    res.json(packages);

  } catch (err) {
    console.error('getPackages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


async function getPackageDetails(req, res) {
  try {
    const state = req.query.state;
    if (!state) {
      return res
        .status(400)
        .json({ message: "Missing required query parameter: state" });
    }

    // find all packages whose `destination` exactly matches the requested state
    const details = await Package.find({ destination: state }).exec();

    if (!details.length) {
      return res
        .status(404)
        .json({ message: `No packages found for destination "${state}"` });
    }

    res.json(details);
  } catch (err) {
    console.error("getPackageDetails error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
async function getPackageById(req, res) {
    try {
      const id = req.params.id;              
      if (!id) {
        return res
          .status(400)
          .json({ message: 'Missing required route parameter: id' });
      }
  
      // If you store Mongo _id, use findById(id)
      // const pkg = await Package.findById(id).exec();
  
      // If you store a numeric `id` field:
      const pkg = await Package.findOne({ id: Number(id) }).exec();
  
      if (!pkg) {
        return res
          .status(404)
          .json({ message: `No package found with id "${id}"` });
      }
  
      // Wrap in array so front‑end loops work unchanged
      res.json(pkg);

    } catch (err) {
      console.error('getPackageById error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  

  

module.exports = { getPackages,getPackageDetails, getPackageById};
