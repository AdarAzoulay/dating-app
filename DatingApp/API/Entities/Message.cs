using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Message
    {
        public int Id { get; set; }

        //2 track the sender
        public int SenderId { get; set; }
        public string SenderUsername { get; set; }
        public AppUser Sender { get; set; }

        //3 track the recipient
        public int RecipientId { get; set; }
        public string RecipientUsername { get; set; }
        public AppUser Recipient { get; set; }

        //5.  message specific properties 

        public string Content { get; set; }
        public DateTime? DateRead { get; set; } //optional => if not been read
        public DateTime MessageSent { get; set; } = DateTime.UtcNow; // on creation of the message

        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }

    }
}